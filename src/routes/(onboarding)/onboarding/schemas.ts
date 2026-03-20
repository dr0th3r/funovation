import * as v from 'valibot';
import * as m from '$lib/paraglide/messages';

export const allergiesSchema = () =>
	v.object({
		allergies: v.array(v.string()),
		// single radio selection stored as array in DB; '' means none
		diet: v.optional(v.picklist(['vegetarian', 'vegan']))
	});

export const preferencesSchema = () =>
	v.object({
		budgetCzk: v.pipe(
			v.fallback(v.number(), 50),
			v.integer(),
			v.minValue(50, m.validation_budget_min()),
			v.maxValue(5000, m.validation_budget_max())
		),
		dislikedFoods: v.array(v.string())
	});

export const goalSchema = () =>
	v.object({
		goals: v.pipe(v.array(v.picklist(['plan', 'learn', 'recommendations'])))
	});
