import { db } from '$lib/server/db';
import { recipe, recipeTranslation } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const requestedLocale = (url.searchParams.get('locale') ?? 'en').toLowerCase();

		const results = await db
			.select({
				name: sql<string>`coalesce((select ${recipeTranslation.name} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = ${requestedLocale} limit 1), (select ${recipeTranslation.name} from ${recipeTranslation} where ${recipeTranslation.recipeId} = ${recipe.id} and ${recipeTranslation.locale} = 'en' limit 1), ${recipe.name})`
			})
			.from(recipe);
		const names = results.map((r) => r.name);

		return json({ names });
	} catch (error) {
		return json({ error: 'Failed to fetch recipe names' }, { status: 500 });
	}
};
