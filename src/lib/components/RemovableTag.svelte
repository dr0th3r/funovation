<script lang="ts">
	import { badgeVariants } from '$lib/components/ui/badge';
	import X from '@lucide/svelte/icons/x';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import * as m from '$lib/paraglide/messages';

	let {
		children,
		onRemove,
		class: className,
		ariaLabel
	}: {
		children: Snippet;
		onRemove: () => void;
		class?: string;
		ariaLabel?: string;
	} = $props();
</script>

<button
	type="button"
	class={cn(
		badgeVariants({ variant: 'secondary' }),
		'group h-6 cursor-pointer px-3 transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive',
		className
	)}
	onclick={onRemove}
	aria-label={ariaLabel ?? m.aria_remove_tag()}
>
	{@render children()}
	<X class="ml-1 size-3" />
</button>
