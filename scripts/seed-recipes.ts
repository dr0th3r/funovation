import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { EXAMPLE_COUNTRIES } from '../src/lib/server/db/example-countries';
import { EXAMPLE_COUNTRY_CS } from '../src/lib/server/db/example-country-cs';
import { EXAMPLE_COUNTRY_TH } from '../src/lib/server/db/example-country-th';
import { EXAMPLE_RECIPE_CS } from '../src/lib/server/db/example-recipe-cs';
import { EXAMPLE_RECIPE_TH } from '../src/lib/server/db/example-recipe-th';
import { EXAMPLE_RECIPES } from '../src/lib/server/db/example-recipes';
import {
	country,
	countryTranslation,
	recipe,
	recipeTranslation
} from '../src/lib/server/db/schema';

if (!process.env.DATABASE_URL) {
	process.loadEnvFile?.('.env');
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const RECIPE_COUNTRY_BY_SLUG: Record<string, string> = {
	shakshuka: 'Israel',
	'chicken-teriyaki-bowl': 'Japan',
	'lentil-coconut-curry': 'India',
	'beef-taco-skillet': 'Mexico',
	'salmon-lemon-dill': 'Sweden',
	'spaghetti-aglio-olio': 'Italy',
	'classic-margherita-pizza': 'Italy',
	'thai-green-chicken-curry': 'Thailand',
	'fluffy-buttermilk-pancakes': 'United States',
	'beef-and-broccoli-stir-fry': 'China',
	'mediterranean-chickpea-salad': 'Greece',
	'creamy-mushroom-risotto': 'Italy',
	'veggie-pad-thai': 'Thailand',
	'french-onion-soup': 'France',
	'greek-moussaka': 'Greece',
	'chicken-tikka-masala': 'India',
	'avocado-toast-poached-egg': 'United States',
	'classic-miso-soup': 'Japan',
	'beef-stroganoff': 'Russia',
	'classic-caprese-salad': 'Italy',
	'tofu-vegetable-stir-fry': 'China',
	'bbq-pulled-pork': 'United States',
	'garlic-shrimp-scampi': 'Italy',
	'tom-yum-goong': 'Thailand'
};

const run = async () => {
	const client = postgres(DATABASE_URL);
	const db = drizzle(client);

	try {
		const countrySeedRows = [...EXAMPLE_COUNTRIES];

		const insertedCountries = await db
			.insert(country)
			.values(countrySeedRows)
			.onConflictDoNothing({ target: country.name })
			.returning({ id: country.id });

		const existingCountries = await db
			.select({
				id: country.id,
				name: country.name
			})
			.from(country);

		const englishCountryTranslations = existingCountries.map((item) => ({
			countryId: item.id,
			locale: 'en',
			name: item.name
		}));

		const countryIdByName = new Map(existingCountries.map((item) => [item.name, item.id]));

		const localizedCountrySeedData = [...EXAMPLE_COUNTRY_CS, ...EXAMPLE_COUNTRY_TH];
		const localizedCountryTranslationRows = localizedCountrySeedData.flatMap((translation) => {
			const countryId = countryIdByName.get(translation.name);
			if (!countryId) {
				console.warn(`Skipping country translation for unknown country: ${translation.name}`);
				return [];
			}

			return [
				{
					countryId,
					locale: translation.locale.toLowerCase(),
					name: translation.translatedName
				}
			];
		});

		const insertedEnglishCountryTranslations = await db
			.insert(countryTranslation)
			.values(englishCountryTranslations)
			.onConflictDoNothing({ target: [countryTranslation.countryId, countryTranslation.locale] })
			.returning({ countryId: countryTranslation.countryId });

		const insertedLocalizedCountryTranslations =
			localizedCountryTranslationRows.length > 0
				? await db
						.insert(countryTranslation)
						.values(localizedCountryTranslationRows)
						.onConflictDoNothing({
							target: [countryTranslation.countryId, countryTranslation.locale]
						})
						.returning({ countryId: countryTranslation.countryId })
				: [];

		const recipeRows = EXAMPLE_RECIPES.flatMap((item) => {
			const countryName = RECIPE_COUNTRY_BY_SLUG[item.slug];
			if (!countryName) {
				console.warn(`Skipping recipe with no country mapping: ${item.slug}`);
				return [];
			}

			return [
				{
					slug: item.slug,
					name: item.name,
					category: item.category,
					cuisine: countryName,
					imageUrl: item.imageUrl,
					ingredients: item.ingredients,
					steps: item.steps,
					timeLengthMinutes: item.timeLengthMinutes,
					preferences: item.preferences,
					pricePerPortionCZK: item.pricePerPortionCZK,
					allergens: item.allergens
				}
			];
		});

		const insertedRecipes = await db
			.insert(recipe)
			.values(recipeRows)
			.onConflictDoNothing({ target: recipe.slug })
			.returning({ slug: recipe.slug });

		const existingRecipes = await db
			.select({
				id: recipe.id,
				slug: recipe.slug,
				name: recipe.name,
				category: recipe.category,
				cuisine: recipe.cuisine,
				ingredients: recipe.ingredients,
				steps: recipe.steps
			})
			.from(recipe);

		const englishTranslations = existingRecipes.map((item) => ({
			recipeId: item.id,
			locale: 'en',
			name: item.name,
			category: item.category,
			cuisine: item.cuisine,
			ingredients: item.ingredients,
			steps: item.steps
		}));

		const insertedEnglishTranslations = await db
			.insert(recipeTranslation)
			.values(englishTranslations)
			.onConflictDoNothing({ target: [recipeTranslation.recipeId, recipeTranslation.locale] })
			.returning({ recipeId: recipeTranslation.recipeId });

		const recipeIdBySlug = new Map(existingRecipes.map((item) => [item.slug, item.id]));

		const countryIdByTranslatedName = new Map<string, number>();
		for (const translation of localizedCountryTranslationRows) {
			countryIdByTranslatedName.set(translation.name.toLowerCase(), translation.countryId);
		}
		// Also add English names to the map
		for (const [name, id] of countryIdByName) {
			countryIdByTranslatedName.set(name.toLowerCase(), id);
		}

		const localizedSeedData = [...EXAMPLE_RECIPE_CS, ...EXAMPLE_RECIPE_TH];

		const localizedTranslationRows = localizedSeedData.flatMap((translation) => {
			const recipeId = recipeIdBySlug.get(translation.slug);
			if (!recipeId) {
				console.warn(`Skipping translation for unknown recipe slug: ${translation.slug}`);
				return [];
			}

			const countryName = RECIPE_COUNTRY_BY_SLUG[translation.slug];
			const countryId = countryName ? countryIdByName.get(countryName) : undefined;

			if (!countryId) {
				console.warn(
					`Skipping translation for unknown cuisine in base recipe: ${translation.slug}`
				);
				return [];
			}

			return [
				{
					recipeId,
					locale: translation.locale.toLowerCase(),
					name: translation.name,
					category: translation.category,
					cuisine: countryId,
					ingredients: translation.ingredients,
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
			`Seed complete: ${insertedCountries.length} new countries, ${insertedEnglishCountryTranslations.length} new country EN translations, ${insertedLocalizedCountryTranslations.length} new localized country translations, ${insertedRecipes.length} new recipes, ${insertedEnglishTranslations.length} new EN recipe translations, ${insertedLocalizedTranslations.length} new localized recipe translations.`
		);
	} finally {
		await client.end();
	}
};

run().catch((error) => {
	console.error('Recipe seed failed:', error);
	process.exit(1);
});
