<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children,
		footer
	}: {
		title?: string;
		description?: string;
		children: Snippet;
		footer?: Snippet;
	} = $props();
</script>

{#snippet content()}
	{#if title || description}
		<Card.Header class="px-0 pt-0 sm:px-6">
			{#if title}
				<Card.Title class="text-2xl">{title}</Card.Title>
			{/if}
			{#if description}
				<Card.Description>{description}</Card.Description>
			{/if}
		</Card.Header>
	{/if}
	<Card.Content class="px-0 pb-0 sm:px-6">
		{@render children()}
	</Card.Content>
	{#if footer}
		<Card.Footer class="flex justify-center px-0 pb-0 sm:px-6 sm:pt-0 sm:pb-6">
			{@render footer()}
		</Card.Footer>
	{/if}
{/snippet}

<Card.Root class="hidden sm:flex">
	{@render content()}
</Card.Root>

<div class="flex flex-col gap-6 sm:hidden">
	{@render content()}
</div>
