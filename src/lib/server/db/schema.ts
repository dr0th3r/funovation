import { integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const recipe = pgTable('recipe', {
	id: serial('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull(),
	category: text('category').notNull(),
	area: text('area').notNull(),
	cuisine: text('cuisine').notNull(),
	imageUrl: text('image_url'),
	ingredients: jsonb('ingredients').$type<string[]>().notNull(),
	simplifiedIngredients: jsonb('simplified_ingredients').$type<string[]>().notNull(),
	steps: jsonb('steps').$type<string[]>().notNull(),
	preferences: jsonb('preferences').$type<string[]>().notNull(),
	pricePerPortionCZK: integer('price_per_portion_czk').notNull(),
	allergens: jsonb('allergens').$type<string[]>().notNull()
});
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
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export * from './auth.schema';
