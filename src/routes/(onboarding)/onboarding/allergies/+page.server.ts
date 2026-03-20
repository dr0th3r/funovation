import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userProfile } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { allergiesSchema } from '../schemas';

export const load: PageServerLoad = async ({ locals }) => {
	const profile = await db.query.userProfile.findFirst({
		where: eq(userProfile.id, locals.user!.id)
	});

	const form = await superValidate(
		{
			allergies: profile?.allergies ?? [],
			diet: (profile?.dietaryRestrictions[0] as 'vegetarian' | 'vegan' | undefined) ?? undefined
		},
		valibot(allergiesSchema())
	);
	return { form };
};

export const actions: Actions = {
	save: async (event) => {
		const form = await superValidate(event.request, valibot(allergiesSchema()));
		if (!form.valid) return fail(400, { form });

		await db
			.update(userProfile)
			.set({
				allergies: form.data.allergies,
				dietaryRestrictions: form.data.diet ? [form.data.diet] : [],
				onboardingStep: 1
			})
			.where(eq(userProfile.id, event.locals.user!.id));

		redirect(302, '/onboarding/preferences');
	},

	skip: async (event) => {
		await db
			.update(userProfile)
			.set({ onboardingStep: 1 })
			.where(eq(userProfile.id, event.locals.user!.id));

		redirect(302, '/onboarding/preferences');
	}
};
