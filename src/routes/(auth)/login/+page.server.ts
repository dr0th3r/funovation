import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { loginSchema } from '../schemas';
import { APIError } from 'better-auth/api';
import * as m from '$lib/paraglide/messages';
import { getOnboardingRedirect } from '$lib/utils/getOnboardingRedirect';

export const load: PageServerLoad = async () => {
	const form = await superValidate(valibot(loginSchema()));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, valibot(loginSchema()));
		if (!form.valid) return fail(400, { form });

		let userId: string;
		try {
			const result = await auth.api.signInEmail({
				body: { email: form.data.email, password: form.data.password }
			});
			userId = result.user.id;
		} catch (e) {
			if (e instanceof APIError) {
				return message(
					form,
					{ type: 'error', text: e.message ?? m.auth_error_invalid_credentials() },
					{ status: 400 }
				);
			}
			return message(
				form,
				{ type: 'error', text: m.auth_error_something_went_wrong() },
				{ status: 500 }
			);
		}

		const dest = await getOnboardingRedirect(userId);
		redirect(302, dest ?? '/');
	}
};
