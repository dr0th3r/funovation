import { db } from '$lib/server/db';
import { EXAMPLE_RECIPES } from '$lib/server/db/example-recipes';
import { recipe } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { count, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const RANDOM_SELECTION_SIZE = 10;

const ensureSeedData = async () => {
	const [{ value }] = await db.select({ value: count() }).from(recipe);

	if (value > 0) {
		return;
	}

	await db
		.insert(recipe)
		.values(EXAMPLE_RECIPES)
		.onConflictDoNothing({ target: recipe.slug });
};

export const GET: RequestHandler = async () => {
	try {
		await ensureSeedData();

		const meals = await db
			.select({
				id: recipe.id,
				name: recipe.name,
				category: recipe.category,
				area: recipe.area,
				imageUrl: recipe.imageUrl,
				ingredients: recipe.ingredients,
				steps: recipe.steps
			})
			.from(recipe)
			.orderBy(sql`random()`)
			.limit(RANDOM_SELECTION_SIZE);

		return json({ meals });
	} catch {
		return json(
			{ error: 'Unable to load recipes from local database' },
			{ status: 502 }
		);
	}
};
