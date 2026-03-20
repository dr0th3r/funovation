import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userProfile } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { preferencesSchema } from '../schemas';

export const load: PageServerLoad = async ({ locals }) => {
	const profile = await db.query.userProfile.findFirst({
		where: eq(userProfile.id, locals.user!.id)
	});

	const step = profile?.onboardingStep ?? 0;
	if (step < 1) redirect(302, '/onboarding/allergies');

	const form = await superValidate(
		{
			budgetCzk: profile?.budgetLunchCzk ?? 200,
			dislikedFoods: profile?.dislikedFoods ?? []
		},
		valibot(preferencesSchema)
	);
	return { form };
};

export const actions: Actions = {
	save: async (event) => {
		const form = await superValidate(event.request, valibot(preferencesSchema));
		if (!form.valid) return fail(400, { form });

		await db
			.update(userProfile)
			.set({
				budgetLunchCzk: form.data.budgetCzk,
				dislikedFoods: form.data.dislikedFoods,
				onboardingStep: 2
			})
			.where(eq(userProfile.id, event.locals.user!.id));

		redirect(302, '/onboarding/goal');
	},

	skip: async (event) => {
		await db
			.update(userProfile)
			.set({ onboardingStep: 2 })
			.where(eq(userProfile.id, event.locals.user!.id));

		redirect(302, '/onboarding/goal');
	}
};
