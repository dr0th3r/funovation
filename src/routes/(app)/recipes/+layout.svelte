<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<div class="w-full">
	<!-- Title + tabs -->
	<section class="px-5 pt-7 pb-0 md:px-8 md:pt-10">
		<h1 class="text-4xl leading-tight font-bold tracking-tight text-foreground md:text-5xl">
			{m.recipes_title()}
		</h1>

		<nav class="mt-5 flex gap-1 border-b border-border">
			<a
				href="/recipes/recommended"
				class="px-4 py-2 text-sm font-semibold transition-colors
					{page.url.pathname.startsWith('/recipes/recommended')
					? 'border-b-2 border-primary text-foreground'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				{m.recipes_tab_recommended()}
			</a>
			<a
				href="/recipes/sale"
				class="px-4 py-2 text-sm font-semibold transition-colors
					{page.url.pathname.startsWith('/recipes/sale')
					? 'border-b-2 border-primary text-foreground'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				{m.recipes_tab_sale()}
			</a>
		</nav>
	</section>

	{@render children()}
</div>
