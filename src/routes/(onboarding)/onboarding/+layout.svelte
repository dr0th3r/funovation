<script lang="ts">
	import { page } from '$app/state';
	import { Progress } from '$lib/components/ui/progress';

	let { children } = $props();

	const steps = ['/onboarding/allergies', '/onboarding/preferences', '/onboarding/goal'];

	const currentStep = $derived(steps.findIndex((s) => page.url.pathname.startsWith(s)) + 1);
	const progress = $derived((currentStep / steps.length) * 100);
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-background p-4">
	<div class="w-full max-w-lg">
		<div class="mb-6 space-y-2">
			<div class="flex items-center justify-between text-sm text-muted-foreground">
				<span>Step {currentStep} of {steps.length}</span>
			</div>
			<Progress value={progress} class="h-2" />
		</div>
		{@render children()}
	</div>
</div>
