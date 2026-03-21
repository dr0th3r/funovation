import { db } from '$lib/server/db';
import { recipe } from '$lib/server/db/schema';
import { buildDietaryFilter, getUserDietaryProfile } from '$lib/server/recipe-filters';
import { asc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;
	const dietaryProfile = await getUserDietaryProfile(userId);
	const dietaryFilter = buildDietaryFilter(dietaryProfile);

	// Recommended: exclude user's allergens + diet, random order, limit 4
	const recommendedRecipes = await db
		.select({
			id: recipe.id,
			name: recipe.name,
			cuisine: recipe.cuisine,
			imageUrl: recipe.imageUrl,
			ingredients: recipe.simplifiedIngredients,
			pricePerPortionCZK: recipe.pricePerPortionCZK,
			preferences: recipe.preferences
		})
		.from(recipe)
		.where(dietaryFilter)
		.orderBy(sql`random()`)
		.limit(4);

	// Budget: cheapest recipes, exclude allergens + diet
	const budgetRecipes = await db
		.select({
			id: recipe.id,
			name: recipe.name,
			cuisine: recipe.cuisine,
			imageUrl: recipe.imageUrl,
			ingredients: recipe.simplifiedIngredients,
			pricePerPortionCZK: recipe.pricePerPortionCZK,
			preferences: recipe.preferences
		})
		.from(recipe)
		.where(dietaryFilter)
		.orderBy(asc(recipe.pricePerPortionCZK))
		.limit(4);

	return { recommendedRecipes, budgetRecipes };
};
