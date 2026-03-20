<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import X from '@lucide/svelte/icons/x';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';

	const ALLERGENS = [
		{ value: 'gluten', label: '1. Gluten (wheat, rye, barley, oats)' },
		{ value: 'crustaceans', label: '2. Crustaceans' },
		{ value: 'eggs', label: '3. Eggs' },
		{ value: 'fish', label: '4. Fish' },
		{ value: 'peanuts', label: '5. Peanuts' },
		{ value: 'soybeans', label: '6. Soybeans' },
		{ value: 'milk', label: '7. Milk (incl. lactose)' },
		{ value: 'nuts', label: '8. Tree nuts' },
		{ value: 'celery', label: '9. Celery' },
		{ value: 'mustard', label: '10. Mustard' },
		{ value: 'sesame', label: '11. Sesame seeds' },
		{ value: 'sulphites', label: '12. Sulphur dioxide & sulphites' },
		{ value: 'lupin', label: '13. Lupin' },
		{ value: 'molluscs', label: '14. Molluscs' }
	];

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
	{#if selected.length > 0}
		<div class="flex flex-wrap gap-1.5">
			{#each selected as value (value)}
				<Badge variant="secondary" class="gap-1 pr-1">
					{shortLabelOf(value)}
					<button
						type="button"
						onclick={() => remove(value)}
						class="ml-0.5 rounded-full hover:text-destructive"
						aria-label="Remove {value}"
					>
						<X class="size-3" />
					</button>
				</Badge>
			{/each}
		</div>
	{/if}

	<Popover.Root bind:open>
		<Popover.Trigger
			bind:ref={triggerRef}
			class={[buttonVariants({ variant: 'outline', class: 'w-full' }), 'justify-between']}
		>
			{selected.length > 0 ? `${selected.length} selected` : 'Select allergens…'}
			<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
		</Popover.Trigger>
		<Popover.Content class="w-full min-w-(--bits-popover-anchor-width) p-0">
			<Command.Root>
				<Command.Input placeholder="Search allergens…" />
				<Command.List>
					<Command.Empty>No allergens found.</Command.Empty>
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
