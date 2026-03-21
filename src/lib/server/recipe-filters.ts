import { recipe } from '$lib/server/db/schema';
import { and, not, sql } from 'drizzle-orm';
import { db } from './db';

/**
 * Loads the user's allergens and dietary restrictions from their profile.
 */
export const getUserDietaryProfile = async (userId: string) => {
	const profile = await db.query.userProfile.findFirst({
		where: (table, { eq }) => eq(table.id, userId)
	});

	return {
		allergens: profile?.allergies ?? [],
		diet: profile?.dietaryRestrictions ?? []
	};
};

/**
 * Builds a Drizzle WHERE condition that:
 * - Excludes recipes whose allergens overlap with the user's allergens
 * - Restricts to recipes whose preferences contain all of the user's dietary restrictions
 *
 * Pass `sql\`true\`` conditions are used as no-ops when the arrays are empty.
 */
export const buildDietaryFilter = ({ allergens, diet }: { allergens: string[]; diet: string[] }) =>
	and(
		allergens.length > 0
			? not(sql`${recipe.allergens} && ${JSON.stringify(allergens)}::jsonb`)
			: sql`true`,
		diet.length > 0 ? sql`${recipe.preferences} @> ${JSON.stringify(diet)}::jsonb` : sql`true`
	);
