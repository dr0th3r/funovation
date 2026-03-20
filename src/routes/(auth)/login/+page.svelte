<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '../schemas';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	const sf = superForm(data.form, { validators: valibot(loginSchema) });
	const { form, enhance, submitting } = sf;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">Welcome back</Card.Title>
		<Card.Description>Sign in to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance class="space-y-4">
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

			<Button type="submit" class="w-full" disabled={$submitting}>
				{$submitting ? 'Signing in…' : 'Sign in'}
			</Button>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-center">
		<p class="text-sm text-muted-foreground">
			Don't have an account?
			<a href="/register" class="text-primary underline-offset-4 hover:underline">Register</a>
		</p>
	</Card.Footer>
</Card.Root>
