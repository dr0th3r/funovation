import * as v from 'valibot';

export const allergiesSchema = v.object({
	allergies: v.array(v.string()),
	// single radio selection stored as array in DB; '' means none
	diet: v.optional(v.picklist(['vegetarian', 'vegan']))
});

export const preferencesSchema = v.object({
	budgetCzk: v.pipe(
		v.fallback(v.number(), 50),
		v.integer(),
		v.minValue(50, 'Budget must be at least 50 Kč'),
		v.maxValue(5000, 'Budget cannot exceed 5 000 Kč')
	),
	dislikedFoods: v.array(v.string())
});

export const goalSchema = v.object({
	goals: v.pipe(v.array(v.picklist(['plan', 'learn', 'recommendations'])))
});
