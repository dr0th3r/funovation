import { db } from '$lib/server/db';
import { userProfile } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getOnboardingRedirect = async (userId: string): Promise<string | null> => {
	const profile = await db.query.userProfile.findFirst({
		where: eq(userProfile.id, userId),
		columns: { onboardingStep: true }
	});
	const step = profile?.onboardingStep ?? 0;
	if (step === 0) return '/onboarding/allergies';
	if (step === 1) return '/onboarding/preferences';
	if (step === 2) return '/onboarding/goal';
	return null; // fully onboarded
};
