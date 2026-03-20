<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { allergiesSchema } from '../schemas';
	import * as Card from '$lib/components/ui/card';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import AllergenCombobox from '$lib/components/AllergenCombobox.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	let { data } = $props();

	const sf = superForm(data.form, { validators: valibot(allergiesSchema) });
	const { form, enhance, submitting } = sf;

	// Map undefined ↔ '' so RadioGroup (string-bound) handles the "none" state
	let dietValue = $state($form.diet ?? '');
	$effect(() => {
		$form.diet = dietValue ? (dietValue as 'vegetarian' | 'vegan') : undefined;
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">Allergies & Diet</Card.Title>
		<Card.Description
			>Tell us what to avoid. You can update this later in settings.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<form method="POST" action="?/save" use:enhance class="space-y-6">
			<div class="space-y-2">
				<Label class="text-sm font-medium">Allergens</Label>
				<AllergenCombobox name="allergies" bind:selected={$form.allergies} />
			</div>

			<Separator />

			<div class="space-y-3">
				<Label class="text-sm font-medium">Dietary preference</Label>
				<RadioGroup.Root bind:value={dietValue} name="diet" class="flex gap-6">
					{#each [{ value: 'vegetarian', label: 'Vegetarian' }, { value: 'vegan', label: 'Vegan' }] as option (option.value)}
						<div class="flex items-center gap-2">
							<RadioGroup.Item value={option.value} id="diet-{option.value}" />
							<Label for="diet-{option.value}" class="cursor-pointer font-normal"
								>{option.label}</Label
							>
						</div>
					{/each}
					<div class="flex items-center gap-2">
						<RadioGroup.Item value="" id="diet-none" />
						<Label for="diet-none" class="cursor-pointer font-normal text-muted-foreground"
							>None</Label
						>
					</div>
				</RadioGroup.Root>
			</div>

			<div class="space-y-3">
				<Button type="submit" class="w-full" disabled={$submitting}>Save & Continue</Button>
				<div class="flex justify-end">
					<Button
						type="submit"
						formaction="?/skip"
						variant="ghost"
						size="sm"
						class="text-muted-foreground"
						disabled={$submitting}
					>
						Skip <ArrowRight class="size-4" />
					</Button>
				</div>
			</div>
		</form>
	</Card.Content>
</Card.Root>
