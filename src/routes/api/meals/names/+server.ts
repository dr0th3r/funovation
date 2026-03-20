import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { recipe } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const results = await db.select({ name: recipe.name }).from(recipe);
		const names = results.map((r) => r.name);

		return json({ names });
	} catch (error) {
		return json({ error: 'Failed to fetch recipe names' }, { status: 500 });
	}
};
