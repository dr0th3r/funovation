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
				name: sql<string>`coalesce((select ${recipeTranslation.cuisine} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = ${requestedLocale} limit 1), (select ${recipeTranslation.cuisine} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = 'en' limit 1), ${recipe.cuisine})`
			})
			.from(recipe);

		const countries = Array.from(new Set(rows.map((row: { name: string }) => row.name))) as string[];
		countries.sort((a, b) => a.localeCompare(b));

		return json({ countries });
	} catch {
		return json({ error: 'Failed to fetch countries' }, { status: 500 });
	}
};
