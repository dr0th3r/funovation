<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { allergiesSchema } from '../schemas';
	import ResponsiveCard from '$lib/components/ResponsiveCard.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import AllergenCombobox from '$lib/components/AllergenCombobox.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	const sf = superForm(data.form, { validators: valibot(allergiesSchema()) });
	const { form, enhance, submitting } = sf;

	// Map undefined ↔ '' so RadioGroup (string-bound) handles the "none" state
	let dietValue = $state($form.diet ?? '');
	$effect(() => {
		$form.diet = dietValue ? (dietValue as 'vegetarian' | 'vegan') : undefined;
	});
</script>

<ResponsiveCard title={m.onboarding_allergies_title()} description={m.onboarding_allergies_description()}>
	<form method="POST" action="?/save" use:enhance class="space-y-6">
		<div class="space-y-2">
			<Label class="text-sm font-medium">{m.onboarding_allergens_label()}</Label>
			<AllergenCombobox name="allergies" bind:selected={$form.allergies} />
		</div>

		<Separator />

		<div class="space-y-3">
			<Label class="text-sm font-medium">{m.onboarding_diet_label()}</Label>
			<RadioGroup.Root bind:value={dietValue} name="diet" class="flex gap-6">
				{#each [{ value: 'vegetarian', label: m.onboarding_diet_vegetarian() }, { value: 'vegan', label: m.onboarding_diet_vegan() }] as option (option.value)}
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
						>{m.onboarding_diet_none()}</Label
					>
				</div>
			</RadioGroup.Root>
		</div>

		<div class="space-y-3">
			<Button type="submit" class="w-full" disabled={$submitting}>{m.common_save_continue()}</Button>
			<div class="flex justify-end">
				<Button
					type="submit"
					formaction="?/skip"
					variant="ghost"
					size="sm"
					class="text-muted-foreground"
					disabled={$submitting}
				>
					{m.common_skip()} <ArrowRight class="size-4" />
				</Button>
			</div>
		</div>
	</form>
</ResponsiveCard>
