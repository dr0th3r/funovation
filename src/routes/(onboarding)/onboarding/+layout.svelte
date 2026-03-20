<script lang="ts">
	import { page } from '$app/state';
	import { Progress } from '$lib/components/ui/progress';
	import * as m from '$lib/paraglide/messages';

	let { children } = $props();

	const steps = [
		{ path: '/onboarding/allergies', label: m.onboarding_step_allergies() },
		{ path: '/onboarding/preferences', label: m.onboarding_step_preferences() },
		{ path: '/onboarding/goal', label: m.onboarding_step_goal() }
	];

	const currentStep = $derived(steps.findIndex((s) => page.url.pathname.startsWith(s.path)) + 1);
	const stepLabel = $derived(steps[currentStep - 1]?.label ?? '');
	const progress = $derived((currentStep / steps.length) * 100);
</script>

<div
	class="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 pt-24 pb-10 sm:py-10"
>
	<div class="absolute top-0 left-0 w-full px-4 pt-8 sm:static sm:w-full sm:max-w-md sm:p-0">
		<div class="mb-4 space-y-3 sm:mb-8">
			<div class="flex items-baseline justify-between">
				<span class="text-sm font-medium">{stepLabel}</span>
				<span class="text-xs text-muted-foreground">{currentStep} / {steps.length}</span>
			</div>
			<Progress value={progress} class="h-1.5" />
		</div>
	</div>
	<div class="w-full max-w-md">
		{@render children()}
	</div>
</div>
