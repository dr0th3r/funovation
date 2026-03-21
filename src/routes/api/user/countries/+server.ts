import { db } from '$lib/server/db';
import { country, userProfile } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const [profile] = await db
			.select({ countries: userProfile.countries })
			.from(userProfile)
			.where(eq(userProfile.id, locals.user.id));

		return json({ countries: profile?.countries ?? [] });
	} catch {
		return json({ error: 'Failed to fetch user countries' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const countryName = body?.country;

		if (typeof countryName !== 'string' || countryName.length === 0) {
			return json({ error: 'Invalid country. Provide a non-empty country name.' }, { status: 400 });
		}

		const [matchedCountry] = await db
			.select({ id: country.id })
			.from(country)
			.where(eq(country.name, countryName));

		if (!matchedCountry) {
			return json({ error: 'Country does not exist (exact name match required).' }, { status: 400 });
		}

		const [existingProfile] = await db
			.select({ countries: userProfile.countries })
			.from(userProfile)
			.where(eq(userProfile.id, locals.user.id));

		if (!existingProfile) {
			const [insertedProfile] = await db
				.insert(userProfile)
				.values({ id: locals.user.id, countries: [countryName] })
				.returning({ countries: userProfile.countries });

			return json({ countries: insertedProfile?.countries ?? [countryName] });
		}

		if (existingProfile.countries.includes(countryName)) {
			return json({ countries: existingProfile.countries });
		}

		const [updatedProfile] = await db
			.update(userProfile)
			.set({
				countries: sql`${userProfile.countries} || ARRAY[${countryName}]::text[]`
			})
			.where(eq(userProfile.id, locals.user.id))
			.returning({ countries: userProfile.countries });

		return json({ countries: updatedProfile?.countries ?? [...existingProfile.countries, countryName] });
	} catch {
		return json({ error: 'Failed to update user countries' }, { status: 500 });
	}
};
