import * as v from 'valibot';

export const allergiesSchema = v.object({
	allergies: v.array(v.string()),
	// single radio selection stored as array in DB; '' means none
	diet: v.optional(v.picklist(['vegetarian', 'vegan']))
});

export const preferencesSchema = v.object({
	budgetCzk: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(5000)),
	dislikedFoods: v.array(v.string())
});

export const goalSchema = v.object({
	goals: v.pipe(v.array(v.picklist(['plan', 'learn', 'recommendations'])))
});
