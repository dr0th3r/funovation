import * as v from 'valibot';
import * as m from '$lib/paraglide/messages';

export const loginSchema = () =>
	v.object({
		email: v.pipe(
			v.string(m.validation_email_required()),
			v.email(m.validation_email_invalid())
		),
		password: v.pipe(v.string(m.validation_password_required()))
	});

export const registerSchema = () =>
	v.object({
		name: v.pipe(
			v.string(m.validation_name_required()),
			v.minLength(2, m.validation_name_min())
		),
		email: v.pipe(
			v.string(m.validation_email_required()),
			v.email(m.validation_email_invalid())
		),
		password: v.pipe(
			v.string(m.validation_password_required_register()),
			v.minLength(8, m.validation_password_min())
		)
	});
