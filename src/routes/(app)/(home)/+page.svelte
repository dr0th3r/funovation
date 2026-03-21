<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import RecipeDetailModal from '$lib/components/RecipeDetailModal.svelte';
	import WorldMap from '$lib/components/WorldMap.svelte';
	import { LayerCake, Svg } from 'layercake';
	import worldData from '$lib/data/world-geo.json';
	import { goto } from '$app/navigation';
	import Star from '@lucide/svelte/icons/star';
	import Coins from '@lucide/svelte/icons/coins';

	import type { PageData } from './$types';

	type Recipe = {
		id: number;
		name: string;
		cuisine: string;
		imageUrl: string | null;
		ingredients: string[];
		pricePerPortionCZK: number;
		preferences: string[];
	};

	let { data }: { data: PageData } = $props();

	let recommendedRecipes = $derived(data.recommendedRecipes);
	let budgetRecipes = $derived(data.budgetRecipes);

	let selectedRecipe: Recipe | null = $state(null);
	let sheetOpen = $state(false);

	const openRecipe = (r: Recipe) => {
		selectedRecipe = r;
		sheetOpen = true;
	};
</script>

<main class="max-w-4xl">
	<!-- Hero -->
	<section class="px-5 pt-7 pb-4 md:px-8 md:pt-10 md:pb-6">
		<h1 class="text-4xl leading-tight font-bold text-foreground md:text-5xl">
			{m.main_hero_title()}
		</h1>
	</section>

	<!-- World Map -->
	<section class="px-5 pb-6 md:px-8 md:pb-8">
		<div class="h-75 overflow-hidden md:h-90">
			<LayerCake data={worldData}>
				<Svg>
					<WorldMap highlights={{ USA: 0.5, CZE: 0.6 }} />
				</Svg>
			</LayerCake>
		</div>
	</section>

	<!-- Recommended recipes -->
	<section class="mt-2 md:mt-4">
		<div class="flex items-center justify-between px-5 pb-3 md:px-8 md:pb-4">
			<div class="flex items-center gap-2">
				<Star class="size-5 text-primary" />
				<h2 class="text-base font-bold text-foreground md:text-lg">
					{m.main_recommended_title()}
				</h2>
			</div>
			<Button
				variant="link"
				class="h-auto p-0 text-sm font-bold underline hover:no-underline"
				onclick={() => goto('/recipes')}
			>
				{m.main_show_all()}
			</Button>
		</div>
		<div
			class="flex gap-[14px] overflow-x-auto px-5 pt-1 pb-4 [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-4 md:overflow-x-visible md:px-8 md:pt-1 md:pb-4 [&::-webkit-scrollbar]:hidden"
		>
			{#each recommendedRecipes as recipe (recipe.id)}
				<Card.Root class="flex-[0_0_230px]! overflow-hidden p-0! md:flex-none!">
					<div class="relative h-35 w-full bg-muted md:h-40">
						{#if recipe.imageUrl}
							<img src={recipe.imageUrl} alt={recipe.name} class="h-full w-full object-cover" />
						{/if}
					</div>
					<Card.Content class="p-3.5">
						<span
							class="mb-1 block text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
						>
							{recipe.cuisine}
						</span>
						<Card.Title class="mb-2 text-sm leading-snug font-bold">{recipe.name}</Card.Title>
						<p class="mb-3 text-xs text-muted-foreground">{recipe.pricePerPortionCZK} Kč/porce</p>
						<Button size="sm" onclick={() => openRecipe(recipe)}>{m.main_view_more()}</Button>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>

	<!-- Budget recipes -->
	<section class="mt-6 pb-10 md:mt-8">
		<div class="flex items-center justify-between px-5 pb-3 md:px-8 md:pb-4">
			<div class="flex items-center gap-2">
				<Coins class="size-5 text-primary" />
				<h2 class="text-base font-bold text-foreground md:text-lg">{m.main_budget_title()}</h2>
			</div>
			<Button
				variant="link"
				class="h-auto p-0 text-sm font-bold underline hover:no-underline"
				onclick={() => goto('/recipes')}
			>
				{m.main_show_all()}
			</Button>
		</div>
		<div
			class="flex gap-[14px] overflow-x-auto px-5 pt-1 pb-4 [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-4 md:overflow-x-visible md:px-8 md:pt-1 md:pb-4 [&::-webkit-scrollbar]:hidden"
		>
			{#each budgetRecipes as recipe (recipe.id)}
				<Card.Root class="flex-[0_0_230px]! overflow-hidden p-0! md:flex-none!">
					<div class="relative h-[140px] w-full bg-muted md:h-[160px]">
						{#if recipe.imageUrl}
							<img src={recipe.imageUrl} alt={recipe.name} class="h-full w-full object-cover" />
						{/if}
					</div>
					<Card.Content class="p-3.5">
						<span
							class="mb-1 block text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
							>{recipe.cuisine}</span
						>
						<Card.Title class="mb-2 text-sm leading-snug font-bold">{recipe.name}</Card.Title>
						<p class="mb-3 text-xs text-muted-foreground">{recipe.pricePerPortionCZK} Kč/porce</p>
						<Button size="sm" onclick={() => openRecipe(recipe)}>{m.main_view_more()}</Button>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>
</main>

<!-- Recipe detail modal (Drawer on mobile, Dialog on desktop) -->
<RecipeDetailModal bind:open={sheetOpen} recipe={selectedRecipe} />
