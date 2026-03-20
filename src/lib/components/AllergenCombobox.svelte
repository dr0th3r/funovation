<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { buttonVariants } from '$lib/components/ui/button';
	import RemovableTagList from '$lib/components/RemovableTagList.svelte';
	import { cn } from '$lib/utils';
	import * as m from '$lib/paraglide/messages';

	const ALLERGENS = $derived([
		{ value: 'gluten', label: m.allergen_gluten() },
		{ value: 'crustaceans', label: m.allergen_crustaceans() },
		{ value: 'eggs', label: m.allergen_eggs() },
		{ value: 'fish', label: m.allergen_fish() },
		{ value: 'peanuts', label: m.allergen_peanuts() },
		{ value: 'soybeans', label: m.allergen_soybeans() },
		{ value: 'milk', label: m.allergen_milk() },
		{ value: 'nuts', label: m.allergen_nuts() },
		{ value: 'celery', label: m.allergen_celery() },
		{ value: 'mustard', label: m.allergen_mustard() },
		{ value: 'sesame', label: m.allergen_sesame() },
		{ value: 'sulphites', label: m.allergen_sulphites() },
		{ value: 'lupin', label: m.allergen_lupin() },
		{ value: 'molluscs', label: m.allergen_molluscs() }
	]);

	let { name, selected = $bindable([]) }: { name: string; selected?: string[] } = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const labelOf = (value: string) => ALLERGENS.find((a) => a.value === value)?.label ?? value;
	const shortLabelOf = (value: string) => labelOf(value).split('.').slice(1).join('.').trim();

	const toggle = (value: string) => {
		if (selected.includes(value)) {
			selected = selected.filter((v) => v !== value);
		} else {
			selected = [...selected, value];
		}
	};

	const remove = (value: string) => {
		selected = selected.filter((v) => v !== value);
	};
</script>

{#each selected as value}
	<input type="hidden" {name} {value} />
{/each}

<div class="flex flex-col gap-2">
	<RemovableTagList tags={selected} onRemove={remove} class="gap-1.5">
		{#snippet tagLabel(value)}
			{shortLabelOf(value)}
		{/snippet}
	</RemovableTagList>

	<Popover.Root bind:open>
		<Popover.Trigger
			bind:ref={triggerRef}
			class={[buttonVariants({ variant: 'outline', class: 'w-full' }), 'justify-between']}
		>
			{selected.length > 0 ? m.onboarding_allergens_trigger_count({ count: selected.length }) : m.onboarding_allergens_trigger_empty()}
			<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
		</Popover.Trigger>
		<Popover.Content class="w-full min-w-(--bits-popover-anchor-width) p-0">
			<Command.Root>
				<Command.Input placeholder={m.onboarding_allergens_search_placeholder()} />
				<Command.List>
					<Command.Empty>{m.onboarding_allergens_no_results()}</Command.Empty>
					<Command.Group>
						{#each ALLERGENS as allergen}
							<Command.Item
								value={allergen.value}
								onSelect={() => {
									toggle(allergen.value);
								}}
							>
								<Check
									class={cn(
										'mr-2 size-4',
										!selected.includes(allergen.value) && 'text-transparent'
									)}
								/>
								{allergen.label}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</div>
