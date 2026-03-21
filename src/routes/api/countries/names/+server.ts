import { db } from '$lib/server/db';
import { country, countryTranslation } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const requestedLocale = (url.searchParams.get('locale') ?? 'en').toLowerCase();

		const rows = await db
			.select({
				id: country.id,
				name: sql<string>`coalesce((select ${countryTranslation.name} from ${countryTranslation} where ${countryTranslation.countryId} = ${country.id} and ${countryTranslation.locale} = ${requestedLocale} limit 1), (select ${countryTranslation.name} from ${countryTranslation} where ${countryTranslation.countryId} = ${country.id} and ${countryTranslation.locale} = 'en' limit 1), ${country.name})`
			})
			.from(country)
			.orderBy(country.name);

		return json({ countries: rows });
	} catch {
		return json({ error: 'Failed to fetch countries' }, { status: 500 });
	}
};
