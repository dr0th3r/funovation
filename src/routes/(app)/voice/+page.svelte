<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import Mic from '@lucide/svelte/icons/mic';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	type Step = { id: number; title: string; description: string };
	type Ingredient = { id: number; name: string; amount: string };

	const recipe = { name: 'Kuřecí nudličky s rýží' };

	const steps: Step[] = [
		{
			id: 1,
			title: 'Oloupat brambory',
			description: 'Oloupejte brambory a nakrájejte na kostičky.'
		},
		{ id: 2, title: 'Uvařit rýži', description: 'Vařte rýži 15 minut v osolené vodě.' },
		{
			id: 3,
			title: 'Opéct kuře',
			description: 'Nakrájejte kuře na nudličky a opečte na oleji dozlatova.'
		},
		{ id: 4, title: 'Smíchat', description: 'Smíchejte rýži s kuřetem a dochuťte solí a pepřem.' }
	];

	const ingredients: Ingredient[] = [
		{ id: 1, name: 'Kuřecí prsa', amount: '300 g' },
		{ id: 2, name: 'Rýže', amount: '200 g' },
		{ id: 3, name: 'Olej', amount: '2 lžíce' },
		{ id: 4, name: 'Sůl', amount: 'podle chuti' },
		{ id: 5, name: 'Pepř', amount: 'podle chuti' }
	];

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

<main class="flex w-xl flex-1 flex-col overflow-hidden">
	<div class="flex-1 overflow-y-auto px-5 pb-20">
		<h1 class="py-6 text-3xl leading-tight font-black tracking-tight text-foreground">
			{recipe.name}
		</h1>

		<div class="mb-6 grid grid-cols-2 gap-2">
			<button
				onclick={() => (activeTab = 'steps')}
				class="rounded-xl border py-2 text-sm font-bold transition-all
					{activeTab === 'steps'
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-background text-muted-foreground'}">{m.voice_tab_steps()}</button
			>
			<button
				onclick={() => (activeTab = 'ingredients')}
				class="rounded-xl border py-2 text-sm font-bold transition-all
					{activeTab === 'ingredients'
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-background text-muted-foreground'}"
				>{m.voice_tab_ingredients()}</button
			>
		</div>

		{#if activeTab === 'steps'}
			<div class="flex flex-col gap-3">
				{#each steps as step, i}
					{#if i === currentStep || i === currentStep + 1}
						<div
							class="rounded-2xl border p-5
							{i === currentStep ? 'border-primary bg-primary/5' : 'border-dashed border-border opacity-55'}"
						>
							<span
								class="mb-1 block text-xs font-bold tracking-widest text-muted-foreground uppercase"
							>
								{i === currentStep ? m.voice_step_current({ step: i + 1 }) : m.voice_step_next()}
							</span>
							<h2 class="text-2xl font-bold text-primary">{step.title}</h2>
							{#if i === currentStep}
								<p class="mt-4 text-sm leading-relaxed text-secondary-foreground">
									{step.description}
								</p>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		{#if activeTab === 'ingredients'}
			<div class="flex flex-col">
				{#each ingredients as ing (ing.id)}
					<div class="flex justify-between border-b border-border py-4 text-sm">
						<span class="font-bold text-foreground">{ing.name}</span>
						<span class="font-medium text-muted-foreground">{ing.amount}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="shrink-0 border-t border-border bg-background p-5">
		<div class="mb-5 flex justify-center">
			<button
				onclick={() => (isRecording = !isRecording)}
				aria-label={isRecording ? 'Stop recording' : 'Start recording'}
				class="flex size-22 items-center justify-center rounded-full transition-all active:scale-95
					{isRecording
					? 'animate-pulse-ring bg-primary text-primary-foreground'
					: 'bg-secondary text-primary'}"
			>
				<Mic class="size-10" />
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
