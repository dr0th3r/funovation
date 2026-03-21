import { db } from '$lib/server/db';
import { recipe } from '$lib/server/db/schema';
import { buildDietaryFilter, getUserDietaryProfile } from '$lib/server/recipe-filters';
import { asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;
	const dietaryProfile = await getUserDietaryProfile(userId);

	const recipes = await db
		.select({
			id: recipe.id,
			name: recipe.name,
			category: recipe.category,
			cuisine: recipe.cuisine,
			imageUrl: recipe.imageUrl,
			ingredients: recipe.simplifiedIngredients,
			pricePerPortionCZK: recipe.pricePerPortionCZK,
			preferences: recipe.preferences
		})
		.from(recipe)
		.where(buildDietaryFilter(dietaryProfile))
		.orderBy(asc(recipe.name));

	return { recipes };
};
