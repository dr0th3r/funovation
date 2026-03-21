import { matchIngredientsWithAi } from '$lib/server/ai/ingredient-matcher';
import { db } from '$lib/server/db';
import { recipe, recipeTranslation, userProfile } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { preferencesSchema } from '../schemas';
import type { Actions, PageServerLoad } from './$types';

const normalizeIngredientKey = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.trim();

const levenshteinDistance = (a: string, b: string) => {
	if (a === b) return 0;
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;

	const previousRow = Array.from({ length: b.length + 1 }, (_, index) => index);

	for (let i = 1; i <= a.length; i++) {
		let diagonal = previousRow[0];
		previousRow[0] = i;

		for (let j = 1; j <= b.length; j++) {
			const temp = previousRow[j];
			const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
			previousRow[j] = Math.min(
				previousRow[j] + 1,
				previousRow[j - 1] + 1,
				diagonal + substitutionCost
			);
			diagonal = temp;
		}
	}

	return previousRow[b.length];
};

const resolveIngredientName = (input: string, canonicalNameByKey: Map<string, string>) => {
	const normalizedInput = normalizeIngredientKey(input);
	if (normalizedInput.length === 0) return undefined;

	const exact = canonicalNameByKey.get(normalizedInput);
	if (exact) return exact;

	if (normalizedInput.length < 3) return undefined;

	let bestMatchKey: string | undefined;
	let bestDistance = Number.POSITIVE_INFINITY;

	for (const key of canonicalNameByKey.keys()) {
		const distance = levenshteinDistance(normalizedInput, key);
		if (distance < bestDistance) {
			bestDistance = distance;
			bestMatchKey = key;
		}
	}

	if (!bestMatchKey) return undefined;

	const maxRelativeDistance = Math.floor(Math.min(normalizedInput.length, bestMatchKey.length) * 0.34);
	const maxAllowedDistance = Math.max(1, maxRelativeDistance);
	if (bestDistance > maxAllowedDistance) return undefined;

	return canonicalNameByKey.get(bestMatchKey);
};

const getRequestedLocale = (event: Parameters<Actions['save']>[0]) => {
	const queryLocale = event.url.searchParams.get('locale')?.toLowerCase();
	if (queryLocale) return queryLocale;

	const headerLocale = event.request.headers.get('accept-language')?.split(',')[0]?.trim();
	if (!headerLocale) return 'en';

	return headerLocale.split('-')[0]?.toLowerCase() || 'en';
};

const getIngredientReferenceNames = async (requestedLocale: string) => {
	const baseIngredients = await db.select({ ingredients: recipe.ingredients }).from(recipe);
	const translatedIngredients = await db
		.select({ ingredients: recipeTranslation.ingredients })
		.from(recipeTranslation)
		.where(eq(recipeTranslation.locale, requestedLocale));

	const allIngredients = [
		...baseIngredients.flatMap((r) => r.ingredients),
		...translatedIngredients.flatMap((r) => r.ingredients ?? [])
	];

	// Extract simplified names if possible, but for now just use the whole strings
	// In a real app, we might want to pre-process these to get "chicken" from "200g chicken"
	// For now, let's just use unique strings and hope for the best with AI/Levenshtein
	return Array.from(new Set(allIngredients)).sort();
};

const normalizeDislikedFoods = async (
	event: Parameters<Actions['save']>[0],
	items: string[]
) => {
	const cleanedItems = Array.from(
		new Set(items.map((item) => item.trim()).filter((item) => item.length > 0))
	);

	if (cleanedItems.length === 0) return [] as string[];

	const requestedLocale = getRequestedLocale(event);
	const referenceNames = await getIngredientReferenceNames(requestedLocale);
	if (referenceNames.length === 0) return [] as string[];

	const canonicalNames = new Map(
		referenceNames.map((name) => [normalizeIngredientKey(name), name])
	);
	const fallbackMatches = cleanedItems
		.map((item) => resolveIngredientName(item, canonicalNames))
		.filter((value): value is string => Boolean(value));

	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		return Array.from(new Set(fallbackMatches));
	}

	const aiMatches = await matchIngredientsWithAi(apiKey, cleanedItems.join(', '), referenceNames);
	const safeMatches = aiMatches
		.map((item) => resolveIngredientName(item, canonicalNames))
		.filter((value): value is string => Boolean(value));

	if (safeMatches.length > 0) {
		return Array.from(new Set(safeMatches));
	}

	return Array.from(new Set(fallbackMatches));
};

export const load: PageServerLoad = async ({ locals }) => {
	const profile = await db.query.userProfile.findFirst({
		where: eq(userProfile.id, locals.user!.id)
	});

	const step = profile?.onboardingStep ?? 0;
	if (step < 1) redirect(302, '/onboarding/allergies');

	const form = await superValidate(
		{
			budgetCzk: profile?.budgetLunchCzk ?? 200,
			dislikedFoods: profile?.dislikedFoods ?? []
		},
		valibot(preferencesSchema())
	);
	return { form };
};

export const actions: Actions = {
	save: async (event) => {
		const form = await superValidate(event.request, valibot(preferencesSchema()));
		if (!form.valid) return fail(400, { form });

		const normalizedDislikedFoods = await normalizeDislikedFoods(event, form.data.dislikedFoods);

		await db
			.update(userProfile)
			.set({
				budgetLunchCzk: form.data.budgetCzk,
				dislikedFoods: normalizedDislikedFoods,
				onboardingStep: 2
			})
			.where(eq(userProfile.id, event.locals.user!.id));

		redirect(302, '/onboarding/goal');
	},

	skip: async (event) => {
		await db
			.update(userProfile)
			.set({ onboardingStep: 2 })
			.where(eq(userProfile.id, event.locals.user!.id));

		redirect(302, '/onboarding/goal');
	}
};
