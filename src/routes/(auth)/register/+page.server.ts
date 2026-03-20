import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { registerSchema } from '../schemas';
import { db } from '$lib/server/db';
import { userProfile } from '$lib/server/db/schema';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = async () => {
	const form = await superValidate(valibot(registerSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, valibot(registerSchema));
		if (!form.valid) return fail(400, { form });

		let userId: string;
		try {
			const result = await auth.api.signUpEmail({
				body: {
					name: form.data.name,
					email: form.data.email,
					password: form.data.password
				},
				headers: event.request.headers
			});
			userId = result.user.id;
		} catch (e) {
			if (e instanceof APIError) {
				return message(
					form,
					{ type: 'error', text: e.message ?? 'Registration failed' },
					{ status: 400 }
				);
			}
			return message(form, { type: 'error', text: 'Something went wrong' }, { status: 500 });
		}

		await db.insert(userProfile).values({ id: userId, onboardingStep: 0 });

		redirect(302, '/onboarding/allergies');
	}
};
