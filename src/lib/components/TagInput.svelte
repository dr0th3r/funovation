<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Badge, badgeVariants } from '$lib/components/ui/badge';
	import X from '@lucide/svelte/icons/x';
	import { cn } from '$lib/utils';

	let { name, initialTags = [] }: { name: string; initialTags?: string[] } = $props();

	let tags = $state<string[]>(initialTags.slice());
	let inputValue = $state('');

	const add = () => {
		const t = inputValue.trim();
		if (t && !tags.includes(t)) tags = [...tags, t];
		inputValue = '';
	};

	const remove = (tag: string) => {
		tags = tags.filter((t) => t !== tag);
	};

	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			add();
		}
	};
</script>

{#each tags as tag}
	<input type="hidden" {name} value={tag} />
{/each}

<div class="space-y-2">
	<div class="flex flex-wrap gap-2">
		{#each tags as tag (tag)}
			<button
				type="button"
				class={cn(
					badgeVariants({ variant: 'secondary' }),
					'group h-6 cursor-pointer px-3 transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive'
				)}
				onclick={() => remove(tag)}
				aria-label="Remove {tag}"
			>
				{tag}
				<X class="ml-1 size-3" />
			</button>
		{/each}
	</div>
	<div class="flex gap-2">
		<Input
			type="text"
			placeholder="Type and press Enter…"
			bind:value={inputValue}
			onkeydown={onKeydown}
			class="flex-1"
		/>
		<Button type="button" variant="outline" onclick={add}>Add</Button>
	</div>
</div>
