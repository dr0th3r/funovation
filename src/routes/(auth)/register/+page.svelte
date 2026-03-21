<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { registerSchema } from '../schemas';
	import ResponsiveCard from '$lib/components/ResponsiveCard.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import FormMessage from '$lib/components/FormMessage.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	const sf = superForm(data.form, { validators: valibot(registerSchema()) });
	const { form, message, enhance, submitting } = sf;
</script>

<ResponsiveCard title={m.auth_register_title()} description={m.auth_register_description()}>
	<form method="POST" use:enhance class="space-y-4">
		<FormMessage message={$message} />

		<Form.Field form={sf} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{m.auth_register_name_label()}</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$form.name}
						placeholder={m.auth_register_name_placeholder()}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field form={sf} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{m.auth_email_label()}</Form.Label>
					<Input
						{...props}
						type="email"
						bind:value={$form.email}
						placeholder={m.auth_email_placeholder()}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field form={sf} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{m.auth_password_label()}</Form.Label>
					<Input
						{...props}
						type="password"
						bind:value={$form.password}
						placeholder={m.auth_password_placeholder()}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="space-y-3">
			<Button type="submit" class="w-full" disabled={$submitting}>
				{$submitting ? m.auth_register_submitting() : m.auth_register_submit()}
			</Button>
			<p class="text-sm text-muted-foreground">
				{m.auth_register_has_account()}
				<a href="/login" class="text-primary underline hover:no-underline">
					{m.auth_register_login_link()}
				</a>
			</p>
		</div>
	</form>
</ResponsiveCard>
