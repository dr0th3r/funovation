import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getOnboardingRedirect } from '../onboarding.server';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');

	// If fully onboarded, send to app
	const dest = await getOnboardingRedirect(locals.user.id);
	if (dest === null) redirect(302, '/');
};
