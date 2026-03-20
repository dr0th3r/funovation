import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getOnboardingRedirect } from '../onboarding.server';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (locals.user) {
		const dest = await getOnboardingRedirect(locals.user.id);
		redirect(302, dest ?? '/');
	}
};
