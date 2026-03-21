<script lang="ts">
	import { setLocale, getLocale, locales } from '$lib/paraglide/runtime';
	import * as Popover from '$lib/components/ui/popover';
	import { buttonVariants } from '$lib/components/ui/button';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { cn } from '$lib/utils';

	const LANGUAGES: Record<string, { label: string; flag: string }> = {
		en: { label: 'English', flag: '🇬🇧' },
		cs: { label: 'Čeština', flag: '🇨🇿' }
	};

	let open = $state(false);
	let current = $derived(LANGUAGES[getLocale()] ?? { label: getLocale(), flag: '🌐' });
</script>

<Popover.Root bind:open>
	<Popover.Trigger class={cn(buttonVariants({ variant: 'ghost' }), 'gap-2 px-2')}>
		<span class="text-base leading-none">{current.flag}</span>
		<span class="text-sm">{current.label}</span>
		<ChevronDown class="size-3.5 text-muted-foreground" />
	</Popover.Trigger>
	<Popover.Content class="w-40 gap-0 p-1" align="end">
		{#each locales as locale}
			{@const lang = LANGUAGES[locale] ?? { label: locale, flag: '🌐' }}
			<button
				type="button"
				onclick={() => {
					setLocale(locale);
					open = false;
				}}
				class={cn(
					'flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent',
					getLocale() === locale && 'font-medium'
				)}
			>
				<span class="text-base leading-none">{lang.flag}</span>
				<span class="flex-1 text-left">{lang.label}</span>
				{#if getLocale() === locale}
					<Check class="size-3.5 text-primary" />
				{/if}
			</button>
		{/each}
	</Popover.Content>
</Popover.Root>
