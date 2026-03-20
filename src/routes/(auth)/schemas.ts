import * as v from 'valibot';

export const loginSchema = v.object({
	email: v.pipe(
		v.string('Please enter your email.'),
		v.email('Please enter a valid email address.')
	),
	password: v.pipe(v.string('Please enter your password.'))
});

export const registerSchema = v.object({
	name: v.pipe(
		v.string('Please enter your name.'),
		v.minLength(2, 'Name must be at least 2 characters.')
	),
	email: v.pipe(
		v.string('Please enter your email.'),
		v.email('Please enter a valid email address.')
	),
	password: v.pipe(
		v.string('Please enter a password.'),
		v.minLength(8, 'Password must be at least 8 characters.')
	)
});
