import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { EXAMPLE_RECIPE_CS } from '../src/lib/server/db/example-recipe-cs';
import { EXAMPLE_RECIPE_TH } from '../src/lib/server/db/example-recipe-th';
import { EXAMPLE_RECIPES } from '../src/lib/server/db/example-recipes';
import { recipe, recipeTranslation } from '../src/lib/server/db/schema';

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
		const insertedRecipes = await db
			.insert(recipe)
			.values(EXAMPLE_RECIPES)
			.onConflictDoNothing({ target: recipe.slug })
			.returning({ slug: recipe.slug });

		const existingRecipes = await db
			.select({
				id: recipe.id,
				slug: recipe.slug,
				name: recipe.name,
				category: recipe.category,
				area: recipe.area,
				cuisine: recipe.cuisine
			})
			.from(recipe);

		const englishTranslations = existingRecipes.map((item) => ({
			recipeId: item.id,
			locale: 'en',
			name: item.name,
			category: item.category,
			area: item.area,
			cuisine: item.cuisine
		}));

		const insertedEnglishTranslations = await db
			.insert(recipeTranslation)
			.values(englishTranslations)
			.onConflictDoNothing({ target: [recipeTranslation.recipeId, recipeTranslation.locale] })
			.returning({ recipeId: recipeTranslation.recipeId });

		const recipeIdBySlug = new Map(existingRecipes.map((item) => [item.slug, item.id]));

		const localizedSeedData = [...EXAMPLE_RECIPE_CS, ...EXAMPLE_RECIPE_TH];

		const localizedTranslationRows = localizedSeedData.flatMap((translation) => {
			const recipeId = recipeIdBySlug.get(translation.slug);
			if (!recipeId) {
				console.warn(`Skipping translation for unknown recipe slug: ${translation.slug}`);
				return [];
			}

			return [
				{
					recipeId,
					locale: translation.locale.toLowerCase(),
					name: translation.name,
					category: translation.category,
					area: translation.area,
					cuisine: translation.cuisine,
					ingredients: translation.ingredients,
					simplifiedIngredients: translation.simplifiedIngredients,
					steps: translation.steps
				}
			];
		});

		const insertedLocalizedTranslations =
			localizedTranslationRows.length > 0
				? await db
						.insert(recipeTranslation)
						.values(localizedTranslationRows)
						.onConflictDoNothing({
							target: [recipeTranslation.recipeId, recipeTranslation.locale]
						})
						.returning({ recipeId: recipeTranslation.recipeId })
				: [];

		console.log(
			`Seed complete: ${insertedRecipes.length} new recipes, ${insertedEnglishTranslations.length} new EN translations, ${insertedLocalizedTranslations.length} new localized translations.`
		);
	} finally {
		await client.end();
	}
};

run().catch((error) => {
	console.error('Recipe seed failed:', error);
	process.exit(1);
});
