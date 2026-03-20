<script lang="ts">
	import { page } from '$app/state';
	import { Progress } from '$lib/components/ui/progress';

	let { children } = $props();

	const steps = [
		{ path: '/onboarding/allergies', label: 'Allergies & Diet' },
		{ path: '/onboarding/preferences', label: 'Preferences' },
		{ path: '/onboarding/goal', label: 'Your goal' }
	];

	const currentStep = $derived(steps.findIndex((s) => page.url.pathname.startsWith(s.path)) + 1);
	const stepLabel = $derived(steps[currentStep - 1]?.label ?? '');
	const progress = $derived((currentStep / steps.length) * 100);
</script>

<div class="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10">
	<div class="w-full max-w-lg">
		<div class="mb-8 space-y-3">
			<div class="flex items-baseline justify-between">
				<span class="text-sm font-medium">{stepLabel}</span>
				<span class="text-xs text-muted-foreground">{currentStep} / {steps.length}</span>
			</div>
			<Progress value={progress} class="h-1.5" />
		</div>
		{@render children()}
	</div>
</div>
