<script lang="ts">
	import RecipePage from '$lib/components/RecipePage.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RecipePage recipes={data.recipes} />
