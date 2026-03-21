<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import RecipeDetailModal from '$lib/components/RecipeDetailModal.svelte';
	import Search from '@lucide/svelte/icons/search';
	import Clock from '@lucide/svelte/icons/clock';

	type Difficulty = 'easy' | 'medium' | 'hard';
	type Category = 'all' | 'soups' | 'mains' | 'salads' | 'desserts' | 'quick';

	type Recipe = {
		id: number;
		name: string;
		time: string;
		price: string;
		color: string;
		category: Exclude<Category, 'all'>;
		difficulty: Difficulty;
		description: string;
		ingredients: string[];
		country: string;
	};

	const allRecipes: Recipe[] = [
		{
			id: 1,
			name: 'Kuřecí nudličky s rýží',
			time: '30 min',
			price: '100 Kč',
			color: '#c9a98a',
			category: 'mains',
			difficulty: 'easy',
			description:
				'Jemné kuřecí nudličky opečené na oleji, podávané s vařenou rýží a čerstvou zeleninou.',
			ingredients: ['Kuřecí prsa 300 g', 'Rýže 200 g', 'Olej 2 lžíce', 'Sůl, pepř'],
			country: '🇨🇿 Česká republika'
		},
		{
			id: 2,
			name: 'Těstovinový salát',
			time: '20 min',
			price: '80 Kč',
			color: '#a8bfa8',
			category: 'salads',
			difficulty: 'easy',
			description: 'Studený salát z vaječných těstovin, zeleniny a majonézy. Ideální na léto.',
			ingredients: ['Těstoviny 250 g', 'Kukuřice', 'Hrášek', 'Majonéza 3 lžíce'],
			country: '🇮🇹 Itálie'
		},
		{
			id: 3,
			name: 'Svíčková na smetaně',
			time: '90 min',
			price: '150 Kč',
			color: '#b8a0c8',
			category: 'mains',
			difficulty: 'hard',
			description:
				'Tradiční české jídlo — hovězí svíčková ve smetanové omáčce s knedlíky a brusinkami.',
			ingredients: [
				'Hovězí svíčková 500 g',
				'Mrkev',
				'Celer',
				'Smetana 200 ml',
				'Houskový knedlík'
			],
			country: '🇨🇿 Česká republika'
		},
		{
			id: 4,
			name: 'Smažený řízek',
			time: '40 min',
			price: '120 Kč',
			color: '#d4a574',
			category: 'mains',
			difficulty: 'medium',
			description:
				'Klasický vídeňský řízek z vepřové kotlety, obalený ve strouhance a smažený dozlatova.',
			ingredients: ['Vepřová kotleta 400 g', 'Vejce 2 ks', 'Strouhanka', 'Olej na smažení'],
			country: '🇦🇹 Rakousko'
		},
		{
			id: 5,
			name: 'Čočková polévka',
			time: '25 min',
			price: '40 Kč',
			color: '#c8b870',
			category: 'soups',
			difficulty: 'easy',
			description: 'Sytá polévka z červené čočky s kmínem, česnekem a kapkou citronu.',
			ingredients: ['Červená čočka 200 g', 'Cibule', 'Česnek', 'Kmín', 'Citron'],
			country: '🇮🇳 Indie'
		},
		{
			id: 6,
			name: 'Bramborová kaše',
			time: '20 min',
			price: '35 Kč',
			color: '#8ab0c0',
			category: 'mains',
			difficulty: 'easy',
			description: 'Krémová bramborová kaše s máslem a mlékem. Dokonalá příloha ke každému jídlu.',
			ingredients: ['Brambory 600 g', 'Máslo 50 g', 'Mléko 100 ml', 'Sůl, muškátový oříšek'],
			country: '🇨🇿 Česká republika'
		},
		{
			id: 7,
			name: 'Fazolový guláš',
			time: '45 min',
			price: '50 Kč',
			color: '#c87860',
			category: 'mains',
			difficulty: 'medium',
			description:
				'Vydatný vegetariánský guláš z červených fazolí, paprik a rajčat s kouřovou paprikou.',
			ingredients: [
				'Červené fazole 400 g',
				'Paprika 2 ks',
				'Rajčatový protlak',
				'Uzená paprika'
			],
			country: '🇲🇽 Mexiko'
		},
		{
			id: 8,
			name: 'Zeleninová polévka',
			time: '30 min',
			price: '45 Kč',
			color: '#90b890',
			category: 'soups',
			difficulty: 'easy',
			description: 'Lehká a výživná polévka plná sezónní zeleniny, bylinek a dobrého vývaru.',
			ingredients: ['Mrkev', 'Celer', 'Petržel', 'Hrášek', 'Zeleninový vývar 1 l'],
			country: '🇫🇷 Francie'
		},
		{
			id: 9,
			name: 'Pad Thai',
			time: '25 min',
			price: '90 Kč',
			color: '#d4b896',
			category: 'mains',
			difficulty: 'medium',
			description: 'Thajské smažené nudličky s krevetami, klíčky fazolí a arašídovou omáčkou.',
			ingredients: [
				'Rýžové nudličky 200 g',
				'Krevety 150 g',
				'Klíčky',
				'Vejce 2 ks',
				'Rybí omáčka'
			],
			country: '🇹🇭 Thajsko'
		},
		{
			id: 10,
			name: 'Tiramisu',
			time: '20 min',
			price: '70 Kč',
			color: '#c8b4a0',
			category: 'desserts',
			difficulty: 'medium',
			description: 'Klasický italský dezert z mascarpone, piškotů namočených v kávě a kakaem.',
			ingredients: ['Mascarpone 250 g', 'Piškoty 200 g', 'Espresso 150 ml', 'Kakao', 'Vejce 3 ks'],
			country: '🇮🇹 Itálie'
		},
		{
			id: 11,
			name: 'Hummus',
			time: '10 min',
			price: '30 Kč',
			color: '#d4c890',
			category: 'quick',
			difficulty: 'easy',
			description: 'Hladký krémový hummus z cizrny, tahini a citronu. Perfektní dip k pita chlebu.',
			ingredients: ['Cizrna 400 g', 'Tahini 2 lžíce', 'Citron', 'Česnek', 'Olivový olej'],
			country: '🇮🇱 Izrael'
		},
		{
			id: 12,
			name: 'Avokádový toast',
			time: '10 min',
			price: '60 Kč',
			color: '#a0c890',
			category: 'quick',
			difficulty: 'easy',
			description: 'Opečený chléb s rozetřeným avokádem, vejcem a vločkami červené papriky.',
			ingredients: ['Chléb 2 plátky', 'Avokádo 1 ks', 'Vejce', 'Citronová šťáva', 'Sůl, pepř'],
			country: '🇺🇸 USA'
		}
	];

	const categories: { id: Category; label: () => string }[] = [
		{ id: 'all', label: m.recipes_cat_all },
		{ id: 'soups', label: m.recipes_cat_soups },
		{ id: 'mains', label: m.recipes_cat_mains },
		{ id: 'salads', label: m.recipes_cat_salads },
		{ id: 'desserts', label: m.recipes_cat_desserts },
		{ id: 'quick', label: m.recipes_cat_quick }
	];

	let activeCategory = $state<Category>('all');
	let searchQuery = $state('');
	let selectedRecipe = $state<Recipe | null>(null);
	let sheetOpen = $state(false);

	const filteredRecipes = $derived(
		allRecipes.filter((r) => {
			const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
			const q = searchQuery.toLowerCase();
			const matchesSearch =
				!q || r.name.toLowerCase().includes(q) || r.country.toLowerCase().includes(q);
			return matchesCategory && matchesSearch;
		})
	);

	const openRecipe = (recipe: Recipe) => {
		selectedRecipe = recipe;
		sheetOpen = true;
	};

	const difficultyLabel: Record<Difficulty, () => string> = {
		easy: m.main_difficulty_easy,
		medium: m.main_difficulty_medium,
		hard: m.main_difficulty_hard
	};

	const difficultyClass: Record<Difficulty, string> = {
		easy: 'bg-[oklch(0.93_0.05_150)] text-[oklch(0.35_0.12_150)]',
		medium: 'bg-[oklch(0.95_0.06_60)] text-[oklch(0.45_0.15_60)]',
		hard: 'bg-[oklch(0.93_0.06_27)] text-[oklch(0.45_0.18_27)]'
	};
</script>

<main class="pb-10">
	<!-- Page title + search -->
	<section class="px-5 pt-7 pb-4 md:px-8 md:pt-10">
		<h1 class="text-4xl leading-tight font-bold tracking-tight text-foreground md:text-5xl">
			{m.recipes_title()}
		</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			{m.recipes_count({ count: allRecipes.length })}
		</p>

		<!-- Search -->
		<div class="relative mt-4 flex items-center">
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
	<div
		class="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
	>
		{#each categories as cat (cat.id)}
			<button
				onclick={() => (activeCategory = cat.id)}
				class="shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold
					{activeCategory === cat.id
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-background text-muted-foreground hover:border-primary hover:text-primary'}"
			>
				{cat.label()}
			</button>
		{/each}
	</div>

	<!-- Results count -->
	<div class="px-5 pt-4 pb-2 md:px-8">
		<span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
			{m.recipes_results({ count: filteredRecipes.length })}
		</span>
	</div>

	<!-- Recipe list / grid -->
	{#if filteredRecipes.length > 0}
		<div class="flex flex-col gap-3 px-5 md:grid md:grid-cols-2 md:gap-4 md:px-8">
			{#each filteredRecipes as recipe (recipe.id)}
				<button
					class="flex items-stretch overflow-hidden rounded-2xl border border-border bg-background text-left hover:border-primary"
					onclick={() => openRecipe(recipe)}
				>
					<!-- Color thumbnail -->
					<div
						class="relative flex w-22 shrink-0 items-end p-1.5"
						style="background-color: {recipe.color}"
					>
						<span class="text-2xl leading-none">{recipe.country.split(' ')[0]}</span>
					</div>

					<!-- Content -->
					<div class="flex flex-1 flex-col justify-center gap-1 px-3.5 py-3">
						<div class="flex items-start justify-between gap-2">
							<span class="text-sm leading-snug font-bold text-foreground">{recipe.name}</span>
							<span
								class="mt-0.5 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-bold {difficultyClass[
									recipe.difficulty
								]}"
							>
								{difficultyLabel[recipe.difficulty]()}
							</span>
						</div>
						<p class="flex items-center gap-1 text-xs text-muted-foreground">
							<Clock class="size-3" />{recipe.time}<span class="mx-1 opacity-40">•</span
							>{recipe.price}/porce
						</p>
					</div>
				</button>
			{/each}
		</div>
	{:else}
		<!-- Empty state -->
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
				{m.main_show_all()}
			</button>
		</div>
	{/if}
</main>

<RecipeDetailModal
	bind:open={sheetOpen}
	recipe={selectedRecipe}
	{difficultyClass}
	{difficultyLabel}
/>
