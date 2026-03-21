<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import RecipeDetailModal from '$lib/components/RecipeDetailModal.svelte';
	import { Progress } from '$lib/components/ui/progress';
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

	const { recommendedRecipes, budgetRecipes } = data;

	let selectedRecipe: Recipe | null = $state(null);
	let sheetOpen = $state(false);

	type UserLevel = { level: number; xp: number; xpMax: number };
	let userLevel = $state<UserLevel>({ level: 8, xp: 90, xpMax: 195 });

	$effect(() => {
		fetch('/api/user/level')
			.then((r) => r.json())
			.then((d: UserLevel) => {
				userLevel = d;
			})
			.catch(() => {});
	});

	const openRecipe = (r: Recipe) => {
		selectedRecipe = r;
		sheetOpen = true;
	};

	const xpPercent = $derived(Math.min((userLevel.xp / userLevel.xpMax) * 100, 100));
</script>

<main>
	<!-- Hero + XP -->
	<section class="px-5 pt-7 pb-6 md:px-8 md:pt-10 md:pb-8">
		<div class="md:flex md:items-end md:gap-16">
			<h1 class="text-4xl leading-tight font-bold text-foreground md:text-5xl">
				{m.main_hero_title()}
			</h1>
			<div class="mt-5 md:mt-0 md:w-72 md:shrink-0">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-bold text-foreground">
						{m.main_level({ level: userLevel.level })}
					</span>
					<span class="text-xs font-semibold text-muted-foreground">
						{userLevel.xp}/{userLevel.xpMax}
					</span>
				</div>
				<Progress value={xpPercent} class="h-2.5" />
			</div>
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
				class="h-auto p-0 text-sm font-bold underline underline-offset-2"
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
					<div class="relative h-[140px] w-full bg-muted md:h-[160px]">
						{#if recipe.imageUrl}
							<img src={recipe.imageUrl} alt={recipe.name} class="h-full w-full object-cover" />
						{/if}
						<span class="absolute bottom-1.5 left-2 text-xs font-semibold text-white drop-shadow"
							>{recipe.cuisine}</span
						>
					</div>
					<Card.Content class="p-3.5">
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
				class="h-auto p-0 text-sm font-bold underline underline-offset-2"
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
						<span class="absolute bottom-1.5 left-2 text-xs font-semibold text-white drop-shadow"
							>{recipe.cuisine}</span
						>
					</div>
					<Card.Content class="p-3.5">
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
