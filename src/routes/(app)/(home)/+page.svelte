<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import RecipeDetailModal from '$lib/components/RecipeDetailModal.svelte';
	import { Progress } from '$lib/components/ui/progress';
	import { goto } from '$app/navigation';
	import Star from '@lucide/svelte/icons/star';
	import Coins from '@lucide/svelte/icons/coins';
	import Clock from '@lucide/svelte/icons/clock';

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

	const recommendedRecipes: Recipe[] = [
		{
			id: 1,
			name: 'Kuřecí nudličky s rýží',
			time: '30 min',
			price: '100 Kč/porce',
			color: '#c9a98a',
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
			price: '80 Kč/porce',
			color: '#a8bfa8',
			difficulty: 'easy',
			description: 'Studený salát z vaječných těstovin, zeleniny a majonézy. Ideální na léto.',
			ingredients: ['Těstoviny 250 g', 'Kukuřice', 'Hrášek', 'Majonéza 3 lžíce'],
			country: '🇮🇹 Itálie'
		},
		{
			id: 3,
			name: 'Svíčková na smetaně',
			time: '90 min',
			price: '150 Kč/porce',
			color: '#b8a0c8',
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
			price: '120 Kč/porce',
			color: '#d4a574',
			difficulty: 'medium',
			description:
				'Klasický vídeňský řízek z vepřové kotlety, obalený ve strouhance a smažený dozlatova.',
			ingredients: ['Vepřová kotleta 400 g', 'Vejce 2 ks', 'Strouhanka', 'Olej na smažení'],
			country: '🇦🇹 Rakousko'
		}
	];

	const budgetRecipes: Recipe[] = [
		{
			id: 5,
			name: 'Čočková polévka',
			time: '25 min',
			price: '40 Kč/porce',
			color: '#c8b870',
			difficulty: 'easy',
			description: 'Sytá polévka z červené čočky s kmínem, česnekem a kapkou citronu.',
			ingredients: ['Červená čočka 200 g', 'Cibule', 'Česnek', 'Kmín', 'Citron'],
			country: '🇮🇳 Indie'
		},
		{
			id: 6,
			name: 'Bramborová kaše',
			time: '20 min',
			price: '35 Kč/porce',
			color: '#8ab0c0',
			difficulty: 'easy',
			description: 'Krémová bramborová kaše s máslem a mlékem. Dokonalá příloha ke každému jídlu.',
			ingredients: ['Brambory 600 g', 'Máslo 50 g', 'Mléko 100 ml', 'Sůl, muškátový oříšek'],
			country: '🇨🇿 Česká republika'
		},
		{
			id: 7,
			name: 'Fazolový guláš',
			time: '45 min',
			price: '50 Kč/porce',
			color: '#c87860',
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
			price: '45 Kč/porce',
			color: '#90b890',
			difficulty: 'easy',
			description: 'Lehká a výživná polévka plná sezónní zeleniny, bylinek a dobrého vývaru.',
			ingredients: ['Mrkev', 'Celer', 'Petržel', 'Hrášek', 'Zeleninový vývar 1 l'],
			country: '🇫🇷 Francie'
		}
	];

	let selectedRecipe: Recipe | null = $state(null);
	let sheetOpen = $state(false);

	type UserLevel = { level: number; xp: number; xpMax: number };
	let userLevel = $state<UserLevel>({ level: 8, xp: 90, xpMax: 195 });

	$effect(() => {
		// fetch('/api/user/level')
		// 	.then((r) => r.json())
		// 	.then((data: UserLevel) => {
		// 		userLevel = data;
		// 	})
		// 	.catch(() => {});
	});

	const openRecipe = (recipe: Recipe) => {
		selectedRecipe = recipe;
		sheetOpen = true;
	};

	const xpPercent = $derived(Math.min((userLevel.xp / userLevel.xpMax) * 100, 100));

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
					<div
						class="relative h-[140px] w-full md:h-[160px]"
						style="background-color: {recipe.color}"
					>
						<span class="absolute bottom-1.5 left-2 text-xl leading-none"
							>{recipe.country.split(' ')[0]}</span
						>
					</div>
					<Card.Content class="p-3.5">
						<div class="mb-1 flex items-start justify-between gap-2">
							<Card.Title class="text-sm leading-snug font-bold">{recipe.name}</Card.Title>
							<span
								class="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-bold {difficultyClass[
									recipe.difficulty
								]}"
							>
								{difficultyLabel[recipe.difficulty]()}
							</span>
						</div>
						<p class="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
							<Clock class="size-3" />{recipe.time}<span class="mx-1">•</span>{recipe.price}
						</p>
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
					<div
						class="relative h-[140px] w-full md:h-[160px]"
						style="background-color: {recipe.color}"
					>
						<span class="absolute bottom-1.5 left-2 text-xl leading-none"
							>{recipe.country.split(' ')[0]}</span
						>
					</div>
					<Card.Content class="p-3.5">
						<div class="mb-1 flex items-start justify-between gap-2">
							<Card.Title class="text-sm leading-snug font-bold">{recipe.name}</Card.Title>
							<span
								class="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-bold {difficultyClass[
									recipe.difficulty
								]}"
							>
								{difficultyLabel[recipe.difficulty]()}
							</span>
						</div>
						<p class="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
							<Clock class="size-3" />{recipe.time}<span class="mx-1">•</span>{recipe.price}
						</p>
						<Button size="sm" onclick={() => openRecipe(recipe)}>{m.main_view_more()}</Button>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>
</main>

<!-- Recipe detail modal (Drawer on mobile, Dialog on desktop) -->
<RecipeDetailModal
	bind:open={sheetOpen}
	recipe={selectedRecipe}
	{difficultyClass}
	{difficultyLabel}
/>
