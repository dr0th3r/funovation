import { db } from '$lib/server/db';
import { ingredient, ingredientTranslation } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const requestedLocale = (url.searchParams.get('locale') ?? 'en').toLowerCase();

		const rows = await db
			.select({
				id: ingredient.id,
				name: sql<string>`coalesce((select ${ingredientTranslation.name} from ${ingredientTranslation} where ${ingredientTranslation.ingredientId} = ${ingredient.id} and ${ingredientTranslation.locale} = ${requestedLocale} limit 1), (select ${ingredientTranslation.name} from ${ingredientTranslation} where ${ingredientTranslation.ingredientId} = ${ingredient.id} and ${ingredientTranslation.locale} = 'en' limit 1), ${ingredient.name})`
			})
			.from(ingredient)
			.orderBy(ingredient.name);

		return json({ ingrediences: rows.map((r) => r.name) });
	} catch {
		return json({ error: 'Failed to fetch ingrediences' }, { status: 500 });
	}
};
