import * as v from 'valibot';

export const loginSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8))
});

export const registerSchema = v.object({
	name: v.pipe(v.string(), v.minLength(2)),
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8))
});
