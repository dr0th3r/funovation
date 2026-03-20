import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const userProfile = pgTable('user_profile', {
	id: text('id').primaryKey(), // = user.id (no FK to avoid auth schema cross-import)
	onboardingStep: integer('onboarding_step').notNull().default(0),
	allergies: text('allergies').array().notNull().default(sql`'{}'`),
	dietaryRestrictions: text('dietary_restrictions').array().notNull().default(sql`'{}'`),
	budgetLunchCzk: integer('budget_lunch_czk'),
	budgetDinnerCzk: integer('budget_dinner_czk'),
	dislikedFoods: text('disliked_foods').array().notNull().default(sql`'{}'`),
	goals: text('goals').array().notNull().default(sql`'{}'`), // 'plan' | 'learn' | 'recommendations'
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export * from './auth.schema';
