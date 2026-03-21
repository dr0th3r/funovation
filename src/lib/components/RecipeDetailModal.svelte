<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto } from '$app/navigation';
	import Clock from '@lucide/svelte/icons/clock';
	import { MediaQuery } from 'svelte/reactivity';

	type Difficulty = 'easy' | 'medium' | 'hard';

	type Recipe = {
		id: number;
		name: string;
		time: string;
		price: string;
		color: string;
		difficulty: Difficulty;
		description: string;
		ingredients: string[];
		country: string;
	};

	let {
		open = $bindable(false),
		recipe,
		difficultyClass,
		difficultyLabel
	}: {
		open: boolean;
		recipe: Recipe | null;
		difficultyClass: Record<Difficulty, string>;
		difficultyLabel: Record<Difficulty, () => string>;
	} = $props();

	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

{#snippet recipeImage()}
	{#if recipe}
		<div class="p-4 pb-0">
			<div class="relative h-40 w-full rounded-2xl" style="background-color: {recipe.color}">
				<span class="absolute bottom-2.5 left-3 text-4xl leading-none"
					>{recipe.country.split(' ')[0]}</span
				>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet recipeMeta()}
	{#if recipe}
		<div class="flex items-start justify-between gap-3">
			<span class="text-xl leading-snug font-bold text-foreground">{recipe.name}</span>
			<span
				class="mt-0.5 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-bold {difficultyClass[
					recipe.difficulty
				]}"
			>
				{difficultyLabel[recipe.difficulty]()}
			</span>
		</div>
		<div class="mt-1 flex flex-wrap items-center gap-3">
			<span class="flex items-center gap-1 text-xs text-muted-foreground">
				<Clock class="size-3" />{recipe.time}
			</span>
			<span class="text-xs text-muted-foreground opacity-40">•</span>
			<span class="text-xs text-muted-foreground">{recipe.price}</span>
			<span class="text-xs text-muted-foreground opacity-40">•</span>
			<span class="text-xs text-muted-foreground">{recipe.country}</span>
		</div>
	{/if}
{/snippet}

{#snippet recipeBody()}
	{#if recipe}
		<div class="px-5 pb-6">
			<p class="mb-5 text-sm leading-relaxed text-secondary-foreground">{recipe.description}</p>
			<p class="mb-2 text-sm font-bold text-foreground">{m.main_ingredients()}</p>
			<ul class="mb-6 flex flex-col gap-2">
				{#each recipe.ingredients as ingredient}
					<li class="flex items-center gap-2 text-sm text-secondary-foreground">
						<span class="size-1.5 shrink-0 rounded-full bg-primary"></span>
						{ingredient}
					</li>
				{/each}
			</ul>
			<Button class="w-full" onclick={() => goto('/voice')}>{m.main_lets_cook()}</Button>
		</div>
	{/if}
{/snippet}

<!-- Mobile: bottom sheet -->
{#if !isDesktop.current}
	<Drawer.Root bind:open>
		<Drawer.Content class="overflow-y-auto p-0">
			{@render recipeImage()}
			<Drawer.Header class="px-5 pt-2">
				{@render recipeMeta()}
			</Drawer.Header>
			{@render recipeBody()}
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<!-- Desktop: dialog -->
	<Dialog.Root bind:open>
		<Dialog.Content class="max-w-lg overflow-hidden p-0">
			{@render recipeImage()}
			<Dialog.Header class="px-5">
				{@render recipeMeta()}
			</Dialog.Header>
			{@render recipeBody()}
		</Dialog.Content>
	</Dialog.Root>
{/if}
