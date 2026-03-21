import { db } from '$lib/server/db';
import {
	country,
	countryTranslation,
	ingredient,
	ingredientTranslation,
	recipe,
	recipeTranslation
} from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const RANDOM_SELECTION_SIZE = 10;

const parseListParam = (values: string[]) => {
	return values
		.flatMap((value) => value.split(','))
		.map((value) => value.trim())
		.filter((value) => value.length > 0);
};

const parseOptionalNumber = (value: string | null) => {
	if (!value) return null;
	const parsed = Number(value);
	if (Number.isNaN(parsed)) return null;
	return parsed;
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const requestedLocale = (url.searchParams.get('locale') ?? 'en').toLowerCase();

		const includeIngredients = parseListParam([
			...url.searchParams.getAll('ingredients'),
			...url.searchParams.getAll('ingrediences'),
			...url.searchParams.getAll('includeIngredients')
		]).map((item) => item.toLowerCase());
		const includePreferences = parseListParam([
			...url.searchParams.getAll('preferences'),
			...url.searchParams.getAll('includePreferences')
		]).map((item) => item.toLowerCase());
		const excludeAllergens = parseListParam(url.searchParams.getAll('excludeAllergens'));
		const excludeIngredients = parseListParam([
			...url.searchParams.getAll('excludeIngredients'),
			...url.searchParams.getAll('excludeIngrediences')
		]).map((item) => item.toLowerCase());
		const excludeCuisines = parseListParam(url.searchParams.getAll('excludeCuisines')).map((item) =>
			item.toLowerCase()
		);
		const maxPricePerPortion = parseOptionalNumber(
			url.searchParams.get('maxPricePerPortionCZK') ?? url.searchParams.get('maxPricePerPortion')
		);

		const conditions = [] as ReturnType<typeof sql>[];

		const requestedIngredientRows = await db
			.select({ ingredientId: ingredientTranslation.ingredientId, name: ingredientTranslation.name })
			.from(ingredientTranslation)
			.where(eq(ingredientTranslation.locale, requestedLocale));

		const englishIngredientRows = await db
			.select({ ingredientId: ingredientTranslation.ingredientId, name: ingredientTranslation.name })
			.from(ingredientTranslation)
			.where(eq(ingredientTranslation.locale, 'en'));

		const canonicalIngredientRows = await db
			.select({ ingredientId: ingredient.id, name: ingredient.name })
			.from(ingredient);

		const ingredientIdByName = new Map<string, number>();
		const ingredientNameById = new Map<number, string>();
		for (const item of [...canonicalIngredientRows, ...englishIngredientRows, ...requestedIngredientRows]) {
			ingredientIdByName.set(item.name.toLowerCase(), item.ingredientId);
			ingredientNameById.set(item.ingredientId, item.name);
		}

		const includeIngredientIds = includeIngredients
			.map((name) => ingredientIdByName.get(name))
			.filter((id): id is number => id !== undefined);

		const excludeIngredientIds = excludeIngredients
			.map((name) => ingredientIdByName.get(name))
			.filter((id): id is number => id !== undefined);

		if (maxPricePerPortion !== null) {
			conditions.push(sql`${recipe.pricePerPortionCZK} <= ${maxPricePerPortion}`);
		}

		if (includeIngredients.length > 0) {
			if (includeIngredientIds.length === 0) {
				conditions.push(sql`false`);
			} else {
				const ingredientAnyMatch = includeIngredientIds.map(
					(ingredientId) => sql`${recipe.simplifiedIngredients} @> ARRAY[${ingredientId}]::integer[]`
				);
				conditions.push(sql`(${sql.join(ingredientAnyMatch, sql` or `)})`);
			}
		}

		if (includePreferences.length > 0) {
			conditions.push(
				sql`${recipe.preferences} @> ${JSON.stringify(includePreferences)}::jsonb`
			);
		}

		if (excludeAllergens.length > 0) {
			for (const allergen of excludeAllergens) {
				conditions.push(sql`not (${recipe.allergens} @> ${JSON.stringify([allergen])}::jsonb)`);
			}
		}

		if (excludeIngredientIds.length > 0) {
			for (const ingredientId of excludeIngredientIds) {
				conditions.push(sql`not (${recipe.simplifiedIngredients} @> ARRAY[${ingredientId}]::integer[])`);
			}
		}

		if (excludeCuisines.length > 0) {
			const excludedCuisineParams = excludeCuisines.map((cuisine) => sql`${cuisine}`);
			conditions.push(
				sql`lower(coalesce((select ${countryTranslation.name} from ${countryTranslation} where ${countryTranslation.countryId} = ${recipe.cuisine} and ${countryTranslation.locale} = ${requestedLocale} limit 1), (select ${countryTranslation.name} from ${countryTranslation} where ${countryTranslation.countryId} = ${recipe.cuisine} and ${countryTranslation.locale} = 'en' limit 1), (select ${country.name} from ${country} where ${country.id} = ${recipe.cuisine} limit 1))) not in (${sql.join(excludedCuisineParams, sql`, `)})`
			);
		}

		const whereClause =
			conditions.length > 0 ? sql`(${sql.join(conditions, sql` and `)})` : undefined;

		const meals = await db
			.select({
				id: recipe.id,
				slug: recipe.slug,
				name: sql<string>`coalesce((select ${recipeTranslation.name} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = ${requestedLocale} limit 1), (select ${recipeTranslation.name} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = 'en' limit 1), ${recipe.name})`,
				category: sql<string>`coalesce((select ${recipeTranslation.category} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = ${requestedLocale} limit 1), (select ${recipeTranslation.category} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = 'en' limit 1), ${recipe.category})`,
				cuisine: sql<string>`coalesce((select ${countryTranslation.name} from ${countryTranslation} where ${countryTranslation.countryId} = ${recipe.cuisine} and ${countryTranslation.locale} = ${requestedLocale} limit 1), (select ${countryTranslation.name} from ${countryTranslation} where ${countryTranslation.countryId} = ${recipe.cuisine} and ${countryTranslation.locale} = 'en' limit 1), (select ${country.name} from ${country} where ${country.id} = ${recipe.cuisine} limit 1))`,
				ingredients: sql<string[]>`coalesce((select ${recipeTranslation.ingredients} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = ${requestedLocale} limit 1), (select ${recipeTranslation.ingredients} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = 'en' limit 1), ${recipe.ingredients})`,
				localizedSimplifiedIngredients: sql<string[] | null>`coalesce((select ${recipeTranslation.simplifiedIngredients} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = ${requestedLocale} limit 1), (select ${recipeTranslation.simplifiedIngredients} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = 'en' limit 1), null)`,
				simplifiedIngredientIds: recipe.simplifiedIngredients,
				steps: sql<string[]>`coalesce((select ${recipeTranslation.steps} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = ${requestedLocale} limit 1), (select ${recipeTranslation.steps} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = 'en' limit 1), ${recipe.steps})`,
				timeLengthMinutes: recipe.timeLengthMinutes,
				imageUrl: recipe.imageUrl,
				preferences: recipe.preferences,
				pricePerPortionCZK: recipe.pricePerPortionCZK,
				allergens: recipe.allergens,
				locale: sql<string>`${requestedLocale}`
			})
			.from(recipe)
			.where(whereClause)
			.orderBy(sql`random()`)
			.limit(RANDOM_SELECTION_SIZE);

		const parseStep = (step: string) => {
			const idx = step.indexOf(';');
			if (idx > 0) {
				return { title: step.slice(0, idx), description: step.slice(idx + 1) };
			}
			return { title: '', description: step };
		};

		const normalizedMeals = meals.map((mealRow: (typeof meals)[number]) => {
			const { localizedSimplifiedIngredients, simplifiedIngredientIds, steps, ...meal } = mealRow;

			return {
				...meal,
				simplifiedIngredients:
					localizedSimplifiedIngredients ??
					simplifiedIngredientIds
						.map((ingredientId: number) => ingredientNameById.get(ingredientId))
						.filter(
							(ingredientName: string | undefined): ingredientName is string =>
								ingredientName !== undefined
						),
				steps: Array.isArray(steps) ? steps.map(parseStep) : []
			};
		});

		return json({ meals: normalizedMeals });
	} catch {
		return json(
			{ error: 'Unable to load recipes from local database' },
			{ status: 502 }
		);
	}
};
