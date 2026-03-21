<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<div class="mx-auto flex min-h-dvh flex-col bg-background">
	<header class="sticky top-0 z-10 shrink-0 border-b border-border bg-background px-5 py-4 md:px-8">
		<div class="mx-auto flex max-w-4xl items-center justify-between">
			<a href={resolve('/')} class="text-2xl font-semibold text-foreground no-underline">Papi</a>

			<div class="flex items-center gap-1">
				<LanguageSwitcher />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props }: { props: Record<string, unknown> })}
							<Button variant="ghost" size="icon" {...props} aria-label={m.main_nav_home()}>
								<Menu />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" sideOffset={8}>
						<DropdownMenu.Item>
							<a href={resolve('/')}>{m.main_nav_home()}</a>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<a href={resolve('/recipes')}>{m.main_nav_recipes()}</a>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</header>

	<div class="flex flex-1 flex-col md:items-center">
		{@render children()}
	</div>
</div>
