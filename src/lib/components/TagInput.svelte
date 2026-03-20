<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import RemovableTagList from '$lib/components/RemovableTagList.svelte';

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
	<RemovableTagList {tags} onRemove={remove} />
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
