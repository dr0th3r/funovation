<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { allergiesSchema } from '../schemas';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import AllergenCombobox from '$lib/components/AllergenCombobox.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	let { data } = $props();

	const sf = superForm(data.form, { validators: valibot(allergiesSchema) });
	const { form, enhance, submitting } = sf;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">Allergies & Diet</Card.Title>
		<Card.Description>
			Tell us what to avoid. You can update this later in settings.
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" action="?/save" use:enhance class="space-y-6">
			<div class="space-y-2">
				<p class="text-sm font-medium">Allergens</p>
				<AllergenCombobox name="allergies" bind:selected={$form.allergies} />
			</div>

			<div class="space-y-3">
				<p class="text-sm font-medium">Dietary preference</p>
				<div class="flex gap-6">
					{#each ['vegetarian', 'vegan'] as diet (diet)}
						<label class="flex cursor-pointer items-center gap-2">
							<input
								type="radio"
								name="diet"
								value={diet}
								checked={$form.diet === diet}
								onchange={() => ($form.diet = diet as 'vegetarian' | 'vegan')}
								class="accent-primary"
							/>
							<span class="text-sm capitalize">{diet}</span>
						</label>
					{/each}
					<label class="flex cursor-pointer items-center gap-2">
						<input
							type="radio"
							name="diet"
							value=""
							checked={!$form.diet}
							onchange={() => ($form.diet = undefined)}
							class="accent-primary"
						/>
						<span class="text-sm text-muted-foreground">None</span>
					</label>
				</div>
			</div>

			<Button type="submit" class="w-full" disabled={$submitting}>Save & Continue</Button>

			<div class="flex items-center justify-end">
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
