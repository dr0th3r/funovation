import { db } from '$lib/server/db';
import { recipe } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) error(400, 'Missing recipe id');

	const id = parseInt(idParam, 10);
	if (isNaN(id)) error(400, 'Invalid recipe id');

	const found = await db.query.recipe.findFirst({
		where: eq(recipe.id, id)
	});
	if (!found) error(404, 'Recipe not found');

	return { recipe: found };
};
