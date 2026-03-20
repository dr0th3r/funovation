<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '../schemas';
	import ResponsiveCard from '$lib/components/ResponsiveCard.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import FormMessage from '$lib/components/FormMessage.svelte';

	let { data } = $props();

	const sf = superForm(data.form, { validators: valibot(loginSchema) });
	const { form, message, enhance, submitting } = sf;
</script>

<ResponsiveCard title="Welcome back" description="Sign in to your account">
	<form method="POST" use:enhance class="space-y-4">
		<FormMessage message={$message} />

		<Form.Field form={sf} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} type="email" bind:value={$form.email} placeholder="you@example.com" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field form={sf} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input {...props} type="password" bind:value={$form.password} placeholder="••••••••" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="space-y-3">
			<Button type="submit" class="w-full" disabled={$submitting}>
				{$submitting ? 'Signing in…' : 'Sign in'}
			</Button>
			<p class="text-sm text-muted-foreground">
				Don't have an account?
				<a href="/register" class="text-primary underline-offset-4 hover:underline">Register</a>
			</p>
		</div>
	</form>
</ResponsiveCard>
