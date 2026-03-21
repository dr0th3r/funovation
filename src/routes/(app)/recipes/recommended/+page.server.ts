import { db } from '$lib/server/db';
import { country, countryTranslation, recipe } from '$lib/server/db/schema';
import { buildDietaryFilter, getUserDietaryProfile } from '$lib/server/recipe-filters';
import { asc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;
	const dietaryProfile = await getUserDietaryProfile(userId);

	const recipes = await db
		.select({
			id: recipe.id,
			name: recipe.name,
			category: recipe.category,
			cuisine: sql<string>`coalesce((select ${countryTranslation.name} from ${countryTranslation} where ${countryTranslation.countryId} = ${recipe.cuisine} and ${countryTranslation.locale} = 'en' limit 1), (select ${country.name} from ${country} where ${country.id} = ${recipe.cuisine} limit 1))`,
			imageUrl: recipe.imageUrl,
			ingredients: recipe.ingredients,
			pricePerPortionCZK: recipe.pricePerPortionCZK,
			preferences: recipe.preferences
		})
		.from(recipe)
		.where(buildDietaryFilter(dietaryProfile))
		.orderBy(asc(recipe.name));

	return { recipes };
};
