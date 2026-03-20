<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { registerSchema } from '../schemas';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	const sf = superForm(data.form, { validators: valibot(registerSchema) });
	const { form, enhance, submitting } = sf;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">Create account</Card.Title>
		<Card.Description>Get started with Funovation</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance class="space-y-4">
			<Form.Field form={sf} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<Input {...props} type="text" bind:value={$form.name} placeholder="Your name" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

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
				{$submitting ? 'Creating account…' : 'Create account'}
			</Button>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-center">
		<p class="text-sm text-muted-foreground">
			Already have an account?
			<a href="/login" class="text-primary underline-offset-4 hover:underline">Sign in</a>
		</p>
	</Card.Footer>
</Card.Root>
