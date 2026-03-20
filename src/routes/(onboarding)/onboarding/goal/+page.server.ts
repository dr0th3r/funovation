import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userProfile } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { goalSchema } from '../schemas';

export const load: PageServerLoad = async ({ locals }) => {
	const profile = await db.query.userProfile.findFirst({
		where: eq(userProfile.id, locals.user!.id)
	});

	const step = profile?.onboardingStep ?? 0;
	if (step < 2) redirect(302, step === 0 ? '/onboarding/allergies' : '/onboarding/preferences');

	const form = await superValidate(
		{ goals: (profile?.goals ?? []) as ('plan' | 'learn' | 'recommendations')[] },
		valibot(goalSchema()),
		{ errors: false }
	);

	return { form };
};

export const actions: Actions = {
	save: async (event) => {
		const form = await superValidate(event.request, valibot(goalSchema()));
		if (!form.valid) return fail(400, { form });

		await db
			.update(userProfile)
			.set({ goals: form.data.goals, onboardingStep: 3 })
			.where(eq(userProfile.id, event.locals.user!.id));

		redirect(302, '/');
	}
};
