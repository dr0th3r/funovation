<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { goalSchema } from '../schemas';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { cn } from '$lib/utils';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	let { data } = $props();

	const sf = superForm(data.form, {
		validators: valibot(goalSchema),
		validationMethod: 'submit-only',

		dataType: 'json'
	});

	const { form, errors, enhance, submitting } = sf;

	const GOALS: Array<{
		value: 'plan' | 'learn' | 'recommendations';
		title: string;
		description: string;
	}> = [
		{
			value: 'plan',
			title: 'Plan meals',
			description: 'Get weekly meal plans tailored to your preferences and budget'
		},
		{
			value: 'learn',
			title: 'Learn to cook',
			description: 'Step-by-step guided cooking with a voice assistant'
		},
		{
			value: 'recommendations',
			title: 'Get recommendations',
			description: 'Discover new recipes based on what you like and what is on sale'
		}
	];

	const toggle = (value: 'plan' | 'learn' | 'recommendations') => {
		if ($form.goals.includes(value)) {
			$form.goals = $form.goals.filter((g) => g !== value);
		} else {
			$form.goals = [...$form.goals, value];
		}
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">What's your goal?</Card.Title>
		<Card.Description>Choose one or more things you'd like to do with Funovation.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" action="?/save" use:enhance class="space-y-4">
			<div class="space-y-3">
				{#each GOALS as goal (goal.value)}
					<button
						type="button"
						class={cn(
							'flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-accent',
							$form.goals.includes(goal.value)
								? 'border-primary bg-primary/5'
								: 'border-border bg-card'
						)}
						onclick={() => toggle(goal.value)}
					>
						<Checkbox
							checked={$form.goals.includes(goal.value)}
							class="mt-0.5 shrink-0"
							aria-hidden="true"
						/>
						<div>
							<p class="font-medium">{goal.title}</p>
							<p class="text-sm text-muted-foreground">{goal.description}</p>
						</div>
					</button>
				{/each}

				{#each $form.goals as goal}
					<input type="hidden" name="goals" value={goal} />
				{/each}
			</div>

			{#if $errors.goals}
				{#each $errors.goals._errors as error}
					<p class="text-sm text-destructive">{error}</p>
				{/each}
			{/if}

			<Button type="submit" class="w-full" disabled={$submitting || $form.goals.length === 0}>
				{$submitting ? 'Setting up…' : 'Get Started'}
			</Button>

			<div class="flex justify-start">
				<Button
					href="/onboarding/preferences"
					variant="ghost"
					size="sm"
					class="text-muted-foreground"
				>
					<ArrowLeft class="size-4" /> Back
				</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
