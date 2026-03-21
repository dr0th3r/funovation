<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto } from '$app/navigation';
	import { MediaQuery } from 'svelte/reactivity';

	type Recipe = {
		id: number;
		name: string;
		cuisine: string;
		imageUrl: string | null;
		ingredients: string[];
		pricePerPortionCZK: number;
		preferences: string[];
	};

	let {
		open = $bindable(false),
		recipe
	}: {
		open: boolean;
		recipe: Recipe | null;
	} = $props();

	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

{#snippet recipeImage()}
	{#if recipe}
		<div class="p-4 pb-0">
			<div class="relative h-40 w-full overflow-hidden rounded-2xl bg-muted">
				{#if recipe.imageUrl}
					<img src={recipe.imageUrl} alt={recipe.name} class="h-full w-full object-cover" />
				{/if}
				<span class="absolute bottom-2.5 left-3 text-xs font-semibold text-white drop-shadow"
					>{recipe.cuisine}</span
				>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet recipeMeta()}
	{#if recipe}
		<div class="flex items-start justify-between gap-3">
			<span class="text-xl leading-snug font-bold text-foreground">{recipe.name}</span>
		</div>
		<div class="mt-1 flex flex-wrap items-center gap-3">
			<span class="text-xs text-muted-foreground">{recipe.pricePerPortionCZK} Kč/porce</span>
			<span class="text-xs text-muted-foreground opacity-40">•</span>
			<span class="text-xs text-muted-foreground">{recipe.cuisine}</span>
		</div>
	{/if}
{/snippet}

{#snippet recipeBody()}
	{#if recipe}
		<div class="px-5 pb-6">
			<p class="mb-2 text-sm font-bold text-foreground">{m.main_ingredients()}</p>
			<ul class="mb-6 flex flex-col gap-2">
				{#each recipe.ingredients as ingredient}
					<li class="flex items-center gap-2 text-sm text-secondary-foreground">
						<span class="size-1.5 shrink-0 rounded-full bg-primary"></span>
						{ingredient}
					</li>
				{/each}
			</ul>
			<Button class="w-full" onclick={() => goto(`/voice?id=${recipe.id}`)}
				>{m.main_lets_cook()}</Button
			>
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
