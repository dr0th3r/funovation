import { db } from '$lib/server/db';
import { recipe, recipeTranslation } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const requestedLocale = (url.searchParams.get('locale') ?? 'en').toLowerCase();

		const rows = await db
			.select({
				ingredients: sql<string[]>`coalesce((select ${recipeTranslation.simplifiedIngredients} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = ${requestedLocale} limit 1), (select ${recipeTranslation.simplifiedIngredients} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = 'en' limit 1), ${recipe.simplifiedIngredients})`
			})
			.from(recipe);

		const names = Array.from(
			new Set(rows.flatMap((row: { ingredients: string[] | null }) => row.ingredients ?? []))
		) as string[];
		names.sort((a, b) => a.localeCompare(b));

		return json({ names });
	} catch {
		return json({ error: 'Failed to fetch ingredient names' }, { status: 500 });
	}
};
