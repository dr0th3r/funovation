<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import Mic from '@lucide/svelte/icons/mic';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let recipe = $derived(data.recipe);

	// DB steps are plain strings — give each an index-based id
	const steps = $derived(recipe.steps.map((description, i) => ({ id: i, description })));
	// DB simplifiedIngredients are plain strings like "Chicken breast 300g"
	const ingredients = $derived(recipe.ingredients.map((name, i) => ({ id: i, name })));

	let activeTab: 'steps' | 'ingredients' = $state('steps');
	let currentStep = $state(0);
	let isRecording = $state(false);

	const prevStep = () => {
		if (currentStep > 0) currentStep--;
	};
	const nextStep = () => {
		if (currentStep < steps.length - 1) currentStep++;
	};
</script>

<main class="flex w-full flex-1 flex-col overflow-hidden md:max-w-xl">
	<div class="flex-1 overflow-y-auto px-4 pb-4">
		<h1 class="py-5 text-2xl leading-tight font-black tracking-tight text-foreground">
			{recipe.name}
		</h1>

		<div class="mb-4 grid grid-cols-2 gap-2">
			<button
				onclick={() => (activeTab = 'steps')}
				class="rounded-xl border py-2.5 text-sm font-bold transition-all
					{activeTab === 'steps'
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-background text-muted-foreground'}">{m.voice_tab_steps()}</button
			>
			<button
				onclick={() => (activeTab = 'ingredients')}
				class="rounded-xl border py-2.5 text-sm font-bold transition-all
					{activeTab === 'ingredients'
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-background text-muted-foreground'}"
			>
				{m.voice_tab_ingredients()}
			</button>
		</div>

		{#if activeTab === 'steps'}
			<div class="flex flex-col gap-3">
				{#each steps as step, i}
					{#if i === currentStep || i === currentStep + 1}
						<div
							class="rounded-2xl border p-4
							{i === currentStep ? 'border-primary bg-primary/5' : 'border-dashed border-border opacity-55'}"
						>
							<span
								class="mb-2 block text-xs font-bold tracking-widest text-muted-foreground uppercase"
							>
								{i === currentStep ? m.voice_step_current({ step: i + 1 }) : m.voice_step_next()}
							</span>
							<p
								class="text-base leading-relaxed {i === currentStep
									? 'text-foreground'
									: 'text-secondary-foreground'}"
							>
								{step.description}
							</p>
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		{#if activeTab === 'ingredients'}
			<div class="flex flex-col">
				{#each ingredients as ing (ing.id)}
					<div class="border-b border-border py-3.5 text-sm">
						<span class="font-semibold text-foreground">{ing.name}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="shrink-0 border-t border-border bg-background px-4 pt-4 pb-6">
		<div class="mb-4 flex justify-center">
			<button
				onclick={() => (isRecording = !isRecording)}
				aria-label={isRecording ? 'Stop recording' : 'Start recording'}
				class="flex size-20 items-center justify-center rounded-full transition-all active:scale-95
					{isRecording
					? 'animate-pulse-ring bg-primary text-primary-foreground'
					: 'bg-secondary text-primary'}"
			>
				<Mic class="size-9" />
			</button>
		</div>

		<div class="flex items-center justify-between">
			<Button variant="ghost" onclick={prevStep} disabled={currentStep === 0} class="font-bold">
				<ChevronLeft class="size-4" />{m.common_back()}
			</Button>
			<span class="text-xs font-bold tracking-widest text-muted-foreground">
				{currentStep + 1} / {steps.length}
			</span>
			<Button
				variant="ghost"
				onclick={nextStep}
				disabled={currentStep === steps.length - 1}
				class="font-bold"
			>
				{m.voice_next()}<ChevronRight class="size-4" />
			</Button>
		</div>
	</div>
</main>

<style>
	@keyframes pulse-ring {
		0% {
			box-shadow: 0 0 0 0 oklch(0.505 0.213 27.518 / 0.4);
		}
		70% {
			box-shadow: 0 0 0 16px oklch(0.505 0.213 27.518 / 0);
		}
		100% {
			box-shadow: 0 0 0 0 oklch(0.505 0.213 27.518 / 0);
		}
	}
	.animate-pulse-ring {
		animation: pulse-ring 1.5s infinite;
	}
</style>
