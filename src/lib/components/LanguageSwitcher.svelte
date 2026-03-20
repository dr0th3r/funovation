<script lang="ts">
	import { setLocale, getLocale, locales } from '$lib/paraglide/runtime';

	const LABELS: Record<string, string> = { en: 'EN', cs: 'CS' };
</script>

<div class="flex items-center gap-1 text-sm font-medium">
	{#each locales as locale}
		<button
			type="button"
			onclick={() => setLocale(locale)}
			class={[
				'rounded px-1.5 py-0.5 transition-colors',
				getLocale() === locale
					? 'bg-primary text-primary-foreground'
					: 'text-muted-foreground hover:text-foreground'
			].join(' ')}
		>
			{LABELS[locale] ?? locale.toUpperCase()}
		</button>
		{#if locale !== locales[locales.length - 1]}
			<span class="text-muted-foreground/50">/</span>
		{/if}
	{/each}
</div>
