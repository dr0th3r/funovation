<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { preferencesSchema } from '../schemas';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';
	import { Separator } from '$lib/components/ui/separator';
	import TagInput from '$lib/components/TagInput.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	let { data } = $props();

	const sf = superForm(data.form, { validators: valibot(preferencesSchema) });
	const { form, errors, enhance, submitting } = sf;

	let budgetValue = $state(data.form.data.budgetCzk ?? 200);

	$effect(() => {
		$form.budgetCzk = budgetValue;
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">Preferences</Card.Title>
		<Card.Description>Set your budget and any foods you'd rather avoid.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" action="?/save" use:enhance class="space-y-6">
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<Label class="text-sm font-medium">Max budget per meal</Label>
					<div class="flex items-center gap-2">
						<Input
							type="number"
							min="0"
							max="5000"
							step="10"
							class="w-24 text-right"
							bind:value={budgetValue}
						/>
						<span class="text-sm text-muted-foreground">Kč</span>
					</div>
				</div>
				<Slider type="single" bind:value={budgetValue} min={0} max={1000} step={10} />
				<input type="hidden" name="budgetCzk" value={budgetValue} />
			</div>

			<Separator />

			<div class="space-y-2">
				<Label>Foods I don't like</Label>
				<!-- BACKLOG: autocomplete from a curated ingredient list -->
				<TagInput name="dislikedFoods" initialTags={$form.dislikedFoods} />
				{#if $errors.dislikedFoods}
					<p class="text-sm text-destructive">{$errors.dislikedFoods}</p>
				{/if}
			</div>

			<Button type="submit" class="w-full" disabled={$submitting}>Save & Continue</Button>

			<div class="flex items-center justify-between">
				<Button
					href="/onboarding/allergies"
					variant="ghost"
					size="sm"
					class="text-muted-foreground"
				>
					<ArrowLeft class="size-4" /> Back
				</Button>
				<Button
					type="submit"
					formaction="?/skip"
					variant="ghost"
					size="sm"
					class="text-muted-foreground"
					disabled={$submitting}
				>
					Skip <ArrowRight />
				</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
