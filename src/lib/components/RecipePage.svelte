<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import RecipeDetailModal from '$lib/components/RecipeDetailModal.svelte';
	import Search from '@lucide/svelte/icons/search';

	export type Recipe = {
		id: number;
		name: string;
		category: string;
		cuisine: string;
		imageUrl: string | null;
		ingredients: string[];
		pricePerPortionCZK: number;
		preferences: string[];
	};

	let { recipes }: { recipes: Recipe[] } = $props();

	const categories: { id: string; label: () => string }[] = [
		{ id: 'all', label: m.recipes_cat_all },
		{ id: 'soups', label: m.recipes_cat_soups },
		{ id: 'mains', label: m.recipes_cat_mains },
		{ id: 'salads', label: m.recipes_cat_salads },
		{ id: 'desserts', label: m.recipes_cat_desserts },
		{ id: 'quick', label: m.recipes_cat_quick }
	];

	let activeCategory = $state('all');
	let searchQuery = $state('');
	let selectedRecipe = $state<Recipe | null>(null);
	let sheetOpen = $state(false);

	const filteredRecipes = $derived(
		recipes.filter((r) => {
			const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
			const q = searchQuery.toLowerCase();
			const matchesSearch =
				!q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q);
			return matchesCategory && matchesSearch;
		})
	);

	const openRecipe = (r: Recipe) => {
		selectedRecipe = r;
		sheetOpen = true;
	};
</script>

<main class="w-full pb-10">
	<!-- Count + search -->
	<section class="pt-5 pb-4">
		<p class="text-sm text-muted-foreground">
			{m.recipes_count({ count: recipes.length })}
		</p>

		<div class="relative mt-3 flex items-center">
			<Search class="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
			<input
				type="search"
				placeholder={m.recipes_search_placeholder()}
				bind:value={searchQuery}
				class="h-11 w-full rounded-xl border border-border bg-secondary pr-4 pl-9 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background"
			/>
		</div>
	</section>

	<!-- Category filters -->
	<div class="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
		{#each categories as cat (cat.id)}
			<button
				onclick={() => (activeCategory = cat.id)}
				class="shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap
					{activeCategory === cat.id
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-background text-muted-foreground hover:border-primary hover:text-primary'}"
			>
				{cat.label()}
			</button>
		{/each}
	</div>

	<!-- Results count -->
	<div class="pt-4 pb-2">
		<span class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
			{m.recipes_results({ count: filteredRecipes.length })}
		</span>
	</div>

	<!-- Recipe list / grid -->
	{#if filteredRecipes.length > 0}
		<div class="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
			{#each filteredRecipes as recipe (recipe.id)}
				<button
					class="flex items-stretch overflow-hidden rounded-2xl border border-border bg-background text-left hover:border-primary"
					onclick={() => openRecipe(recipe)}
				>
					<!-- Thumbnail -->
					<div class="relative flex w-22 shrink-0 items-end overflow-hidden bg-muted p-1.5">
						{#if recipe.imageUrl}
							<img
								src={recipe.imageUrl}
								alt={recipe.name}
								class="absolute inset-0 h-full w-full object-cover"
							/>
						{/if}
					</div>

					<!-- Content -->
					<div class="flex flex-1 flex-col justify-center gap-0.5 px-3.5 py-3">
						<span class="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
							{recipe.cuisine}
						</span>
						<span class="text-sm leading-snug font-bold text-foreground">{recipe.name}</span>
						<p class="text-xs text-muted-foreground">{recipe.pricePerPortionCZK} Kč/porce</p>
					</div>
				</button>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center gap-3 px-5 py-16">
			<Search class="size-10 text-muted-foreground opacity-40" />
			<p class="text-sm font-medium text-muted-foreground">{m.recipes_no_results()}</p>
			<button
				onclick={() => {
					searchQuery = '';
					activeCategory = 'all';
				}}
				class="text-sm font-bold text-primary underline underline-offset-2"
			>
				{m.recipes_cat_all()}
			</button>
		</div>
	{/if}
</main>

<RecipeDetailModal bind:open={sheetOpen} recipe={selectedRecipe} />
