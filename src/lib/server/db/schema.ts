import { integer, jsonb, pgTable, serial, text } from 'drizzle-orm/pg-core';

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

export * from './auth.schema';
