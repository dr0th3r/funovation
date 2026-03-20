import { getOnboardingRedirect } from '$lib/utils/getOnboardingRedirect';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');

	const dest = await getOnboardingRedirect(locals.user.id);
	if (dest !== null) redirect(302, dest);
};
