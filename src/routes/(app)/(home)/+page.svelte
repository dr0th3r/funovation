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
	import X from '@lucide/svelte/icons/x';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Utensils from '@lucide/svelte/icons/utensils';
	import countryInfoMap from '$lib/data/country-info.json';

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

	let hoveredCountry = $state<any>(null);
	let mousePos = $state({ x: 0, y: 0 });

	const handleCountryHover = (feature: any, e: MouseEvent) => {
		hoveredCountry = feature;
		mousePos = { x: e.clientX, y: e.clientY };
	};

	const handleCountryLeave = () => {
		hoveredCountry = null;
	};

	let clickedCountry = $state<any>(null);

	const handleCountryClick = (feature: any) => {
		clickedCountry = feature;
	};

	const clickedInfo = $derived(
		clickedCountry ? (countryInfoMap as Record<string, { capital: string; meal: string }>)[clickedCountry.id] || { capital: 'Unknown Capital', meal: 'Traditional Local Cuisine' } : null
	);
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
					<WorldMap
						highlights={{ USA: 0.5, CZE: 0.6 }}
						onCountryHover={handleCountryHover}
						onCountryLeave={handleCountryLeave}
						onCountryClick={handleCountryClick}
					/>
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
					<Card.Content class="flex flex-col flex-1 p-3.5">
						<span
							class="mb-1 block text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
						>
							{recipe.cuisine}
						</span>
						<Card.Title class="mb-2 text-sm leading-snug font-bold">{recipe.name}</Card.Title>
						<p class="mb-3 text-xs text-muted-foreground">{recipe.pricePerPortionCZK} Kč/porce</p>
						<Button size="sm" class="mt-auto" onclick={() => openRecipe(recipe)}
							>{m.main_view_more()}</Button
						>
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
					<Card.Content class="flex flex-col flex-1 p-3.5">
						<span
							class="mb-1 block text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
							>{recipe.cuisine}</span
						>
						<Card.Title class="mb-2 text-sm leading-snug font-bold">{recipe.name}</Card.Title>
						<p class="mb-3 text-xs text-muted-foreground">{recipe.pricePerPortionCZK} Kč/porce</p>
						<Button size="sm" class="mt-auto" onclick={() => openRecipe(recipe)}
							>{m.main_view_more()}</Button
						>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>
</main>

<!-- Recipe detail modal (Drawer on mobile, Dialog on desktop) -->
<RecipeDetailModal bind:open={sheetOpen} recipe={selectedRecipe} />

<!-- Hover Tooltip -->
{#if hoveredCountry && !clickedCountry}
	<div
		class="pointer-events-none fixed z-50 flex flex-col gap-1 rounded-2xl border border-white/20 bg-background/70 p-4 text-foreground shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
		style="left: {mousePos.x + 15}px; top: {mousePos.y + 15}px;"
	>
		<span class="text-xs font-bold tracking-widest text-muted-foreground uppercase">
			{hoveredCountry.id}
		</span>
		<strong class="text-lg leading-none">{hoveredCountry.properties.name}</strong>
		<span class="mt-1 text-sm font-semibold text-primary">Click for details</span>
	</div>
{/if}

<!-- Clicked Country Modal -->
{#if clickedCountry}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
		<div class="w-full max-w-sm relative rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
			<!-- Header -->
			<div class="mb-5 pr-8">
				<span class="text-xs font-black tracking-widest text-primary uppercase">{clickedCountry.id}</span>
				<h2 class="text-3xl font-black text-foreground">{clickedCountry.properties.name}</h2>
			</div>

			<!-- Close Button -->
			<button
				onclick={() => clickedCountry = null}
				class="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
			>
				<X class="size-4" />
			</button>

			<!-- Information Grid -->
			<div class="flex flex-col gap-4">
				<div class="flex items-start gap-4 rounded-2xl bg-muted/50 p-4">
					<div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-background shadow-sm text-primary">
						<MapPin class="size-5" />
					</div>
					<div>
						<p class="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Main City</p>
						<p class="text-lg font-bold text-foreground">{clickedInfo.capital}</p>
					</div>
				</div>

				<div class="flex items-start gap-4 rounded-2xl bg-muted/50 p-4">
					<div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-background shadow-sm text-primary">
						<Utensils class="size-5" />
					</div>
					<div>
						<p class="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Typical Meal</p>
						<p class="text-lg font-bold text-foreground">{clickedInfo.meal}</p>
					</div>
				</div>
			</div>

		</div>
	</div>
{/if}
