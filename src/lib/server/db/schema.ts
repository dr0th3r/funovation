import { sql } from 'drizzle-orm';
import { integer, jsonb, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const country = pgTable('country', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique()
});

export const countryTranslation = pgTable(
	'country_translation',
	{
		countryId: integer('country_id')
			.notNull()
			.references(() => country.id, { onDelete: 'cascade' }),
		locale: text('locale').notNull(),
		name: text('name').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.countryId, table.locale] })
	})
);

export const ingredient = pgTable('ingredient', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique()
});

export const ingredientTranslation = pgTable(
	'ingredient_translation',
	{
		ingredientId: integer('ingredient_id')
			.notNull()
			.references(() => ingredient.id, { onDelete: 'cascade' }),
		locale: text('locale').notNull(),
		name: text('name').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.ingredientId, table.locale] })
	})
);

export const recipe = pgTable('recipe', {
	id: serial('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull(),
	category: text('category').notNull(),
	cuisine: text('cuisine').notNull(),
	imageUrl: text('image_url'),
	ingredients: jsonb('ingredients').$type<string[]>().notNull(),
	simplifiedIngredients: integer('simplified_ingredients').array().notNull(),
	steps: jsonb('steps').$type<string[]>().notNull(),
	timeLengthMinutes: integer('time_length_minutes').notNull(),
	preferences: jsonb('preferences').$type<string[]>().notNull(),
	pricePerPortionCZK: integer('price_per_portion_czk').notNull(),
	allergens: jsonb('allergens').$type<string[]>().notNull()
});

export const recipeTranslation = pgTable(
	'recipe_translation',
	{
		recipeId: integer('recipe_id')
			.notNull()
			.references(() => recipe.id, { onDelete: 'cascade' }),
		locale: text('locale').notNull(),
		name: text('name').notNull(),
		category: text('category').notNull(),
		cuisine: text('cuisine').notNull(),
		ingredients: jsonb('ingredients').$type<string[]>(),
		simplifiedIngredients: jsonb('simplified_ingredients').$type<string[]>(),
		steps: jsonb('steps').$type<string[]>(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.recipeId, table.locale] })
	})
);

export const userProfile = pgTable('user_profile', {
	id: text('id').primaryKey(), // = user.id (no FK to avoid auth schema cross-import)
	onboardingStep: integer('onboarding_step').notNull().default(0),
	allergies: text('allergies')
		.array()
		.notNull()
		.default(sql`'{}'`),
	dietaryRestrictions: text('dietary_restrictions')
		.array()
		.notNull()
		.default(sql`'{}'`),
	budgetLunchCzk: integer('budget_lunch_czk'),
	budgetDinnerCzk: integer('budget_dinner_czk'),
	dislikedFoods: text('disliked_foods')
		.array()
		.notNull()
		.default(sql`'{}'`),
	goals: text('goals')
		.array()
		.notNull()
		.default(sql`'{}'`), // 'plan' | 'learn' | 'recommendations'
	countries: text('countries')
		.array()
		.notNull()
		.default(sql`'{}'`),
	xp: integer('xp').notNull().default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export * from './auth.schema';
