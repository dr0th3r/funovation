<script lang="ts">
	import RemovableTag from '$lib/components/RemovableTag.svelte';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		tags,
		onRemove,
		class: className,
		tagLabel
	}: {
		tags: string[];
		onRemove: (tag: string) => void;
		class?: string;
		tagLabel?: Snippet<[string]>;
	} = $props();
</script>

{#if tags.length > 0}
	<div class={cn('flex flex-wrap gap-2', className)}>
		{#each tags as tag (tag)}
			<RemovableTag onRemove={() => onRemove(tag)} ariaLabel="Remove {tag}">
				{#if tagLabel}
					{@render tagLabel(tag)}
				{:else}
					{tag}
				{/if}
			</RemovableTag>
		{/each}
	</div>
{/if}
