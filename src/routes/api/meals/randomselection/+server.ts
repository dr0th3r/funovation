import { db } from '$lib/server/db';
import { recipe } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
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

		if (maxPricePerPortion !== null) {
			conditions.push(sql`${recipe.pricePerPortionCZK} <= ${maxPricePerPortion}`);
		}

		if (includeIngredients.length > 0) {
			const ingredientAnyMatch = includeIngredients.map(
				(ingredient) => sql`${recipe.simplifiedIngredients} @> ${JSON.stringify([ingredient])}::jsonb`
			);
			conditions.push(sql`(${sql.join(ingredientAnyMatch, sql` or `)})`);
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

		if (excludeIngredients.length > 0) {
			for (const ingredient of excludeIngredients) {
				conditions.push(
					sql`not (${recipe.simplifiedIngredients} @> ${JSON.stringify([ingredient])}::jsonb)`
				);
			}
		}

		if (excludeCuisines.length > 0) {
			const excludedCuisineParams = excludeCuisines.map((cuisine) => sql`${cuisine}`);
			conditions.push(
				sql`lower(${recipe.cuisine}) not in (${sql.join(excludedCuisineParams, sql`, `)})`
			);
		}

		const whereClause =
			conditions.length > 0 ? sql`(${sql.join(conditions, sql` and `)})` : undefined;

		const meals = await db
			.select({
				id: recipe.id,
				slug: recipe.slug,
				name: recipe.name,
				category: recipe.category,
				area: recipe.area,
				cuisine: recipe.cuisine,
				imageUrl: recipe.imageUrl,
				ingredients: recipe.ingredients,
				simplifiedIngredients: recipe.simplifiedIngredients,
				steps: recipe.steps,
				preferences: recipe.preferences,
				pricePerPortionCZK: recipe.pricePerPortionCZK,
				allergens: recipe.allergens
			})
			.from(recipe)
			.where(whereClause)
			.orderBy(sql`random()`)
			.limit(RANDOM_SELECTION_SIZE);

		return json({ meals });
	} catch {
		return json(
			{ error: 'Unable to load recipes from local database' },
			{ status: 502 }
		);
	}
};
