<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { goalSchema } from '../schemas';
	import ResponsiveCard from '$lib/components/ResponsiveCard.svelte';
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
			title: 'Discover new recipes',
			description:
				'Get personalized recipe recommendations based on your preferences and what is on sale'
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

<ResponsiveCard title="What's your goal?" description="Pick one or more to get started.">
	<form method="POST" action="?/save" use:enhance class="space-y-6">
		<div class="space-y-2.5">
			{#each GOALS as goal (goal.value)}
				<button
					type="button"
					class={cn(
						'flex w-full items-start gap-3 rounded-lg border p-5 text-left transition-colors duration-150 hover:bg-accent',
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
					<div class="space-y-0.5">
						<p class="leading-none font-medium">{goal.title}</p>
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

		<div class="space-y-3">
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
		</div>
	</form>
</ResponsiveCard>
