import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { EXAMPLE_RECIPES } from '../src/lib/server/db/example-recipes';
import { recipe } from '../src/lib/server/db/schema';

if (!process.env.DATABASE_URL) {
	process.loadEnvFile?.('.env');
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const run = async () => {
	const client = postgres(DATABASE_URL);
	const db = drizzle(client);

	try {
		const inserted = await db
			.insert(recipe)
			.values(EXAMPLE_RECIPES)
			.onConflictDoNothing({ target: recipe.slug })
			.returning({ slug: recipe.slug });

		console.log(
			`Seed complete: ${inserted.length} new recipes inserted, ${EXAMPLE_RECIPES.length - inserted.length} already existed.`
		);
	} finally {
		await client.end();
	}
};

run().catch((error) => {
	console.error('Recipe seed failed:', error);
	process.exit(1);
});
