<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { preferencesSchema } from '../schemas';
	import ResponsiveCard from '$lib/components/ResponsiveCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';
	import { Separator } from '$lib/components/ui/separator';
	import TagInput from '$lib/components/TagInput.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	const sf = superForm(data.form, { validators: valibot(preferencesSchema()) });
	const { form, errors, enhance, submitting } = sf;
</script>

<ResponsiveCard title={m.onboarding_preferences_title()} description={m.onboarding_preferences_description()}>
	<form method="POST" action="?/save" use:enhance class="space-y-6">
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<Label class="text-sm font-medium">{m.onboarding_preferences_budget_label()}</Label>
				<span class="text-sm font-medium text-muted-foreground">
					{$form.budgetCzk} Kč
				</span>
			</div>
			<Slider type="single" bind:value={$form.budgetCzk as number} min={50} max={1000} step={10} />
			<input type="hidden" name="budgetCzk" value={$form.budgetCzk ?? ''} />
		</div>

		<Separator />

		<div class="space-y-2">
			<Label class="text-sm font-medium">{m.onboarding_preferences_dislikes_label()}</Label>
			<!-- BACKLOG: autocomplete from a curated ingredient list -->
			<TagInput name="dislikedFoods" initialTags={$form.dislikedFoods} />
			{#if $errors.dislikedFoods}
				<p class="text-sm text-destructive">{$errors.dislikedFoods}</p>
			{/if}
		</div>

		<div class="space-y-3">
			<Button type="submit" class="w-full" disabled={$submitting}>{m.common_save_continue()}</Button>
			<div class="flex items-center justify-between">
				<Button
					href="/onboarding/allergies"
					variant="ghost"
					size="sm"
					class="text-muted-foreground"
				>
					<ArrowLeft class="size-4" /> {m.common_back()}
				</Button>
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
