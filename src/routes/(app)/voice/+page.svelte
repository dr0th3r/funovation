<script lang="ts">
	import { tick, onDestroy } from 'svelte';
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import Mic from '@lucide/svelte/icons/mic';
	import MicOff from '@lucide/svelte/icons/mic-off';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Timer from '@lucide/svelte/icons/timer';
	import Camera from '@lucide/svelte/icons/camera';
	import Share2 from '@lucide/svelte/icons/share-2';
	import Home from '@lucide/svelte/icons/home';
	import { SvelteSet, SvelteMap } from 'svelte/reactivity';
	import { goto } from '$app/navigation';

	import type { PageData } from './$types';

	type Step = { id: number; title: string; description: string };
	type Ingredient = { id: number; name: string };
	type ConnectionState = 'disconnected' | 'connecting' | 'connected';
	type ActiveTimer = { id: number; label: string; remaining: number; paused?: boolean };

	let { data }: { data: PageData } = $props();

	const recipe = data.recipe;
	const steps: Step[] = recipe.steps.map((raw, i) => {
		const sep = raw.indexOf(';');
		return sep === -1
			? { id: i, title: '', description: raw }
			: { id: i, title: raw.slice(0, sep), description: raw.slice(sep + 1) };
	});
	const ingredients: Ingredient[] = recipe.ingredients.map((name, i) => ({ id: i, name }));

	let activeTab: 'steps' | 'ingredients' = $state('steps');
	let currentStep = $state(0);
	let recipeFinished = $state(false);

	// Camera state
	let cameraActive = $state(false);
	let capturedImage = $state<string | null>(null);
	let videoEl: HTMLVideoElement | null = $state(null);
	let canvasEl: HTMLCanvasElement | null = $state(null);
	let cameraStream: MediaStream | null = null;
	let showCancelConfirmation = $state(false);

	// Voice state
	let connectionState = $state<ConnectionState>('disconnected');
	let isAiSpeaking = $state(false);
	let isUserSpeaking = $state(false);
	let errorMessage = $state<string | null>(null);
	let aiTranscript = $state<string | null>(null);
	let activeTimers = $state<ActiveTimer[]>([]);

	// Compliance state
	let showConsentModal = $state(false);
	let aiConsentAccepted = $state(false);
	let aiActChecked = $state(false);
	let gdprChecked = $state(false);

	const handleMicClick = () => {
		if (!aiConsentAccepted && connectionState === 'disconnected') {
			showConsentModal = true;
		} else {
			toggleConnection();
		}
	};

	const handleConsentSubmit = () => {
		if (aiActChecked && gdprChecked) {
			showConsentModal = false;
			aiConsentAccepted = true;
			toggleConnection();
		}
	};

	// Non-reactive refs
	let pc: RTCPeerConnection | null = null;
	let dc: RTCDataChannel | null = null;
	let audioEl: HTMLAudioElement | null = null;
	let timerNextId = 0;
	const handledCallIds = new SvelteSet<string>();
	const timerIntervals = new SvelteMap<number, ReturnType<typeof setInterval>>();

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`;
	};

	const scheduleTimer = (label: string, delaySeconds: number) => {
		const id = timerNextId++;
		activeTimers = [...activeTimers, { id, label, remaining: delaySeconds }];

		const intervalId = setInterval(() => {
			activeTimers = activeTimers.map((t) =>
				t.id === id && !t.paused ? { ...t, remaining: t.remaining - 1 } : t
			);

			const timer = activeTimers.find((t) => t.id === id);
			if (!timer || timer.remaining <= 0) {
				clearInterval(intervalId);
				timerIntervals.delete(id);
				activeTimers = activeTimers.filter((t) => t.id !== id);

				if (dc?.readyState === 'open') {
					dc.send(
						JSON.stringify({
							type: 'response.create',
							response: { instructions: `Timer finished. Briefly remind the user now: ${label}` }
						})
					);
				}
			}
		}, 1000);

		timerIntervals.set(id, intervalId);
	};

	const handleFunctionCall = (name: string, callId: string, argsText: string) => {
		if (!dc || dc.readyState !== 'open' || !callId || handledCallIds.has(callId)) return;
		handledCallIds.add(callId);

		let args: Record<string, unknown> = {};
		try {
			args = argsText ? JSON.parse(argsText) : {};
		} catch {
			args = {};
		}

		let output: Record<string, unknown>;

		if (name === 'set_cooking_timer') {
			const reminderText = String(args.reminder_text ?? '').trim();
			const delaySeconds = Number(args.delay_seconds);

			if (
				!reminderText ||
				!Number.isInteger(delaySeconds) ||
				delaySeconds < 5 ||
				delaySeconds > 7200
			) {
				output = { scheduled: false, error: 'Invalid timer arguments' };
			} else {
				scheduleTimer(reminderText, delaySeconds);
				output = {
					scheduled: true,
					reminder_text: reminderText,
					delay_seconds: delaySeconds,
					fire_at: new Date(Date.now() + delaySeconds * 1000).toISOString()
				};
			}
		} else if (name === 'next_recipe_step') {
			nextStep();
			output = { success: true, current_step: currentStep };
		} else if (name === 'previous_recipe_step') {
			prevStep();
			output = { success: true, current_step: currentStep };
		} else if (name === 'cancel_recipe') {
			output = { success: true };
			showCancelConfirmation = true;
		} else if (name === 'pause_cooking_timer') {
			if (activeTimers.length > 0) {
				activeTimers = activeTimers.map((t) => ({ ...t, paused: true }));
				output = { success: true };
			} else {
				output = { success: false, error: 'No active timer to pause.' };
			}
		} else if (name === 'resume_cooking_timer') {
			if (activeTimers.length > 0) {
				activeTimers = activeTimers.map((t) => ({ ...t, paused: false }));
				output = { success: true };
			} else {
				output = { success: false, error: 'No paused timer to resume.' };
			}
		} else if (name === 'stop_cooking_timer') {
			if (activeTimers.length > 0) {
				// Clear all intervals and empty the timers array
				timerIntervals.forEach(clearInterval);
				timerIntervals.clear();
				activeTimers = [];
				output = { success: true };
			} else {
				output = { success: false, error: 'No active timer to stop.' };
			}
		} else {
			output = { scheduled: false, error: `Unknown tool: ${name}` };
		}

		dc.send(
			JSON.stringify({
				type: 'conversation.item.create',
				item: { type: 'function_call_output', call_id: callId, output: JSON.stringify(output) }
			})
		);
		dc.send(JSON.stringify({ type: 'response.create' }));
	};

	const connect = async () => {
		connectionState = 'connecting';
		errorMessage = '';

		try {
			const res = await fetch('/api/voice/session', { method: 'POST' });
			if (!res.ok) throw new Error(`Session error ${res.status}`);
			const data = await res.json();
			const ephemeralKey: string = data.client_secret.value;
			const model: string = data.model ?? 'gpt-4o-realtime-preview-2024-12-17';

			pc = new RTCPeerConnection();

			audioEl = document.createElement('audio');
			audioEl.autoplay = true;
			pc.ontrack = (e) => {
				if (audioEl) audioEl.srcObject = e.streams[0];
			};

			const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
			ms.getTracks().forEach((t) => pc!.addTrack(t, ms));

			dc = pc.createDataChannel('oai-events');

			dc.onopen = () => {
				connectionState = 'connected';
				dc!.send(
					JSON.stringify({
						type: 'session.update',
						session: {
							modalities: ['text', 'audio'],
							turn_detection: { type: 'server_vad' }
						}
					})
				);

				const recipeContext = `I want to cook ${recipe.name}. The ingredients are: ${ingredients.map((i) => i.name).join(', ')}. The steps are: ${steps.map((s, i) => `${i + 1}. ${s.title ? s.title + ': ' : ''}${s.description}`).join(' ')}. Guide me step by step starting with step 1.`;
				dc!.send(
					JSON.stringify({
						type: 'conversation.item.create',
						item: {
							type: 'message',
							role: 'user',
							content: [{ type: 'input_text', text: recipeContext }]
						}
					})
				);
				dc!.send(JSON.stringify({ type: 'response.create' }));
			};

			dc.onclose = () => {
				if (connectionState === 'connected') {
					connectionState = 'disconnected';
				}
			};

			dc.onmessage = (event) => {
				try {
					const msg = JSON.parse(event.data as string);

					if (msg.type === 'response.audio_transcript.delta') {
						aiTranscript += msg.delta;
					} else if (msg.type === 'response.output_item.added' && msg.item?.type === 'message') {
						aiTranscript = '';
						isAiSpeaking = true;
					} else if (msg.type === 'response.done') {
						isAiSpeaking = false;
					} else if (msg.type === 'input_audio_buffer.speech_started') {
						isUserSpeaking = true;
					} else if (msg.type === 'input_audio_buffer.speech_stopped') {
						isUserSpeaking = false;
					} else if (msg.type === 'response.function_call_arguments.done') {
						handleFunctionCall(msg.name, msg.call_id, msg.arguments);
					} else if (
						msg.type === 'response.output_item.done' &&
						msg.item?.type === 'function_call'
					) {
						handleFunctionCall(msg.item.name, msg.item.call_id, msg.item.arguments ?? '{}');
					}
				} catch {
					// ignore parse errors
				}
			};

			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);

			const sdpRes = await fetch(`https://api.openai.com/v1/realtime?model=${model}`, {
				method: 'POST',
				body: offer.sdp,
				headers: {
					Authorization: `Bearer ${ephemeralKey}`,
					'Content-Type': 'application/sdp'
				}
			});

			if (!sdpRes.ok) throw new Error(`SDP error ${sdpRes.status}`);

			await pc.setRemoteDescription({ type: 'answer', sdp: await sdpRes.text() });
		} catch (err) {
			console.error('Voice connection error:', err);
			errorMessage = err instanceof Error ? err.message : 'Connection failed';
			connectionState = 'disconnected';
			pc?.close();
			pc = null;
			dc = null;
		}
	};

	const disconnect = () => {
		timerIntervals.forEach(clearInterval);
		timerIntervals.clear();
		handledCallIds.clear();
		pc?.close();
		pc = null;
		dc = null;
		if (audioEl) {
			audioEl.srcObject = null;
			audioEl = null;
		}
		activeTimers = [];
		connectionState = 'disconnected';
		isAiSpeaking = false;
		isUserSpeaking = false;
		aiTranscript = '';
	};

	const toggleConnection = () => {
		if (connectionState === 'disconnected') connect();
		else if (connectionState === 'connected') disconnect();
	};

	const prevStep = () => {
		if (currentStep > 0) currentStep--;
	};
	const nextStep = () => {
		if (currentStep < steps.length - 1) currentStep++;
	};

	const finishRecipe = async () => {
		if (connectionState === 'connected') disconnect();
		recipeFinished = true;
	};

	const shareRecipe = async () => {
		try {
			if (navigator.share) {
				await navigator.share({
					title: `I just cooked ${recipe.name}!`,
					text: `Check out this recipe for ${recipe.name}. I just made it using the Funovation AI assistant!`,
					url: window.location.href
				});
			} else {
				alert('Web Share API is not supported in your browser.');
			}
		} catch (error) {
			console.log('Error sharing', error);
		}
	};

	const confirmCancel = async () => {
		disconnect();
		await goto('/');
	};

	const resumeCooking = () => {
		showCancelConfirmation = false;
		if (dc?.readyState === 'open') {
			dc.send(
				JSON.stringify({
					type: 'conversation.item.create',
					item: {
						type: 'message',
						role: 'user',
						content: [{ type: 'input_text', text: 'I decided to keep cooking. Please continue.' }]
					}
				})
			);
			dc.send(JSON.stringify({ type: 'response.create' }));
		}
	};

	const startCamera = async () => {
		cameraActive = true;
		capturedImage = null;
		await tick(); // Wait for video element to render
		try {
			cameraStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' }
			});
			if (videoEl) {
				videoEl.srcObject = cameraStream;
			}
		} catch (err) {
			console.error('Camera error', err);
			alert('Could not access camera. Please check permissions.');
			cameraActive = false;
		}
	};

	const stopCamera = () => {
		if (cameraStream) {
			cameraStream.getTracks().forEach((t) => t.stop());
			cameraStream = null;
		}
		cameraActive = false;
	};

	const takePhoto = () => {
		if (videoEl && canvasEl) {
			canvasEl.width = videoEl.videoWidth;
			canvasEl.height = videoEl.videoHeight;
			const ctx = canvasEl.getContext('2d');
			if (ctx) {
				ctx.drawImage(videoEl, 0, 0);
				capturedImage = canvasEl.toDataURL('image/jpeg', 0.8);
				stopCamera();
			}
		}
	};

	const retakePhoto = () => {
		capturedImage = null;
		startCamera();
	};

	onDestroy(() => {
		stopCamera();
		disconnect();
	});

	const statusLabel = $derived(
		connectionState === 'connecting'
			? m.voice_status_connecting()
			: connectionState === 'disconnected'
				? m.voice_status_idle()
				: isUserSpeaking
					? m.voice_status_listening()
					: isAiSpeaking
						? m.voice_status_speaking()
						: m.voice_status_ready()
	);

	const micActive = $derived(connectionState === 'connected');
	const micPulsing = $derived(isAiSpeaking || isUserSpeaking);
</script>

<main class="relative flex w-xl flex-1 flex-col overflow-hidden">
	<div class="flex-1 overflow-y-auto px-5 pb-20">
		<h1 class="py-6 text-3xl leading-tight font-black tracking-tight text-foreground">
			{recipe.name}
		</h1>

		<!-- Timers -->
		{#if activeTimers.length > 0}
			<div class="mb-4 flex flex-wrap gap-2">
				{#each activeTimers as timer (timer.id)}
					<div
						class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all
						{timer.paused
							? 'border-muted bg-muted text-muted-foreground opacity-70'
							: 'border-amber-200 bg-amber-50 text-amber-700'}"
					>
						<Timer class="size-3.5" />
						<span>{timer.label}</span>
						<span class="font-mono tabular-nums">
							{#if timer.paused}(Paused)
							{/if}
							{formatTime(timer.remaining)}
						</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Tabs -->
		<div class="mb-6 grid grid-cols-2 gap-2">
			<button
				onclick={() => (activeTab = 'steps')}
				class="rounded-xl border py-2 text-sm font-bold transition-all
						{activeTab === 'steps'
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-background text-muted-foreground'}">{m.voice_tab_steps()}</button
			>
			<button
				onclick={() => (activeTab = 'ingredients')}
				class="rounded-xl border py-2 text-sm font-bold transition-all
						{activeTab === 'ingredients'
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-background text-muted-foreground'}"
				>{m.voice_tab_ingredients()}</button
			>
		</div>

		{#if activeTab === 'steps'}
			<div class="flex flex-col gap-3">
				{#each steps as step, i (step.id)}
					{#if i === currentStep || i === currentStep + 1}
						<div
							class="rounded-2xl border p-5
								{i === currentStep ? 'border-primary bg-primary/5' : 'border-dashed border-border opacity-55'}"
						>
							<span
								class="mb-1 block text-xs font-bold tracking-widest text-muted-foreground uppercase"
							>
								{i === currentStep ? m.voice_step_current({ step: i + 1 }) : m.voice_step_next()}
							</span>
							{#if step.title}
								<h2 class="text-xl font-bold text-primary">{step.title}</h2>
							{/if}
							<p
								class="mt-1 text-base leading-relaxed {i === currentStep
									? 'text-foreground'
									: 'text-secondary-foreground'}"
							>
								{step.description}
							</p>
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		{#if activeTab === 'ingredients'}
			<div class="flex flex-col">
				{#each ingredients as ing (ing.id)}
					<div class="border-b border-border py-4 text-sm">
						<span class="font-semibold text-foreground">{ing.name}</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- AI transcript -->
		{#if aiTranscript && connectionState === 'connected'}
			<div class="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
				<p class="text-sm leading-relaxed text-foreground">{aiTranscript}</p>
			</div>
		{/if}
	</div>

	<div class="shrink-0 border-t border-border bg-background p-5">
		<!-- Status / error -->
		<div class="mb-3 text-center">
			{#if errorMessage}
				<p class="text-xs font-medium text-destructive">{errorMessage}</p>
			{:else}
				<p class="text-xs font-bold tracking-widest text-muted-foreground uppercase">
					{statusLabel}
				</p>
			{/if}
		</div>

		<!-- Mic button -->
		<div class="mb-5 flex justify-center">
			<button
				onclick={handleMicClick}
				disabled={connectionState === 'connecting'}
				aria-label={micActive ? m.voice_aria_stop() : m.voice_aria_start()}
				class="flex size-22 items-center justify-center rounded-full transition-all active:scale-95 disabled:opacity-50
						{micActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'}
						{micPulsing ? 'animate-pulse-ring' : ''}"
			>
				{#if connectionState === 'connecting'}
					<div
						class="size-6 animate-spin rounded-full border-2 border-current border-t-transparent"
					></div>
				{:else if micActive}
					<MicOff class="size-10" />
				{:else}
					<Mic class="size-10" />
				{/if}
			</button>
		</div>

		<div class="flex items-center justify-between">
			<Button variant="ghost" onclick={prevStep} disabled={currentStep === 0} class="font-bold">
				<ChevronLeft class="size-4" />{m.common_back()}
			</Button>
			<span class="text-xs font-bold tracking-widest text-muted-foreground">
				{currentStep + 1} / {steps.length}
			</span>
			{#if currentStep === steps.length - 1}
				<Button variant="destructive" onclick={finishRecipe} class="font-bold">
					{m.voice_btn_finish()}
				</Button>
			{:else}
				<Button variant="ghost" onclick={nextStep} class="font-bold">
					{m.voice_next()}<ChevronRight class="size-4" />
				</Button>
			{/if}
		</div>
	</div>

	{#if recipeFinished}
		<!-- Post-Cook Completion Screen -->
		<div
			class="fixed inset-0 z-50 flex animate-in items-center justify-center bg-background/80 px-4 backdrop-blur-sm duration-300 fade-in"
		>
			<div
				class="flex w-full max-w-sm animate-in flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-xl duration-300 zoom-in-95"
			>
				<div class="mb-6 flex size-24 items-center justify-center rounded-full bg-primary/10">
					<span class="text-5xl">🎉</span>
				</div>

				<h1 class="mb-2 text-3xl font-black tracking-tight text-foreground">
					{m.voice_finish_title()}
				</h1>
				<p class="mb-10 text-muted-foreground">
					{m.voice_finish_description({ name: recipe.name })}
				</p>

				<div class="flex w-full max-w-sm flex-col gap-4">
					{#if cameraActive}
						<div
							class="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-4 border-primary bg-black"
						>
							<video bind:this={videoEl} autoplay playsinline class="h-full w-full object-cover"
							></video>
							<canvas bind:this={canvasEl} class="hidden"></canvas>

							<div class="absolute right-0 bottom-4 left-0 flex justify-center gap-4">
								<Button
									size="icon"
									variant="secondary"
									class="h-14 w-14 rounded-full shadow-lg"
									onclick={stopCamera}
								>
									X
								</Button>
								<Button
									size="icon"
									variant="default"
									class="h-14 w-14 rounded-full border-2 border-white shadow-lg"
									onclick={takePhoto}
								>
									<Camera class="size-6" />
								</Button>
							</div>
						</div>
					{:else if capturedImage}
						<div
							class="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-4 border-primary shadow-lg"
						>
							<img src={capturedImage} alt="Your cooked meal" class="h-full w-full object-cover" />
							<div class="absolute right-0 bottom-4 left-0 flex justify-center gap-2 px-4">
								<Button
									variant="secondary"
									size="sm"
									class="font-bold shadow-md"
									onclick={retakePhoto}
								>
									{m.voice_btn_retake()}
								</Button>
							</div>
						</div>
					{:else}
						<Button
							size="lg"
							variant="default"
							class="w-full gap-2 font-bold"
							onclick={startCamera}
						>
							<Camera class="size-5" />{m.voice_btn_take_photo()}
						</Button>
					{/if}

					<Button
						size="lg"
						variant="secondary"
						onclick={shareRecipe}
						class="pointer-events-auto mt-2 w-full gap-2 font-bold"
					>
						<Share2 class="size-5" />{m.voice_btn_share()}
					</Button>

					<Button
						size="lg"
						variant="ghost"
						onclick={async () => await goto('/')}
						class="pointer-events-auto mt-2 w-full gap-2 font-bold"
					>
						<Home class="size-5" />{m.voice_btn_home()}
					</Button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Cancel Confirmation Popup -->
	{#if showCancelConfirmation}
		<div
			class="fixed inset-0 z-50 flex animate-in items-center justify-center bg-background/80 px-4 backdrop-blur-sm duration-200 fade-in"
		>
			<div
				class="w-full max-w-sm animate-in rounded-3xl border border-border bg-card p-6 shadow-xl duration-200 zoom-in-95"
			>
				<h2 class="mb-2 text-center text-2xl font-black text-foreground">
					{m.voice_cancel_title()}
				</h2>
				<p class="mb-6 text-center text-sm text-muted-foreground">
					{m.voice_cancel_description()}
				</p>
				<div class="flex flex-col gap-3">
					<Button variant="destructive" size="lg" onclick={confirmCancel} class="w-full font-bold">
						{m.voice_cancel_confirm()}
					</Button>
					<Button variant="outline" size="lg" onclick={resumeCooking} class="w-full font-bold">
						{m.voice_cancel_resume()}
					</Button>
				</div>
			</div>
		</div>
	{/if}

	<!-- EU AI Act & GDPR Consent Modal -->
	{#if showConsentModal}
		<div
			class="fixed inset-0 z-50 flex animate-in items-center justify-center bg-background/80 px-4 backdrop-blur-sm duration-200 fade-in"
		>
			<div
				class="w-full max-w-sm animate-in rounded-3xl border border-border bg-card p-6 shadow-xl duration-200 zoom-in-95"
			>
				<h2 class="mb-2 text-center text-2xl font-black text-foreground">
					{m.voice_consent_title()}
				</h2>
				<p class="mb-4 text-center text-sm text-muted-foreground">
					{m.voice_consent_description()}
				</p>
				<div class="mb-6 flex flex-col gap-4">
					<label class="flex cursor-pointer items-start gap-3">
						<input
							type="checkbox"
							bind:checked={aiActChecked}
							class="mt-0.5 h-6 w-6 shrink-0 rounded border-input bg-background text-primary accent-primary focus:ring-primary"
						/>
						<span class="text-sm leading-tight font-medium text-foreground">
							{m.voice_consent_ai_act()}
						</span>
					</label>
					<label class="flex cursor-pointer items-start gap-3">
						<input
							type="checkbox"
							bind:checked={gdprChecked}
							class="mt-0.5 h-6 w-6 shrink-0 rounded border-input bg-background text-primary accent-primary focus:ring-primary"
						/>
						<span class="text-sm leading-tight font-medium text-foreground">
							{m.voice_consent_gdpr()}
						</span>
					</label>
				</div>
				<div class="flex flex-col gap-3">
					<Button
						variant="default"
						size="lg"
						disabled={!aiActChecked || !gdprChecked}
						onclick={handleConsentSubmit}
						class="w-full font-bold"
					>
						{m.voice_consent_accept()}
					</Button>
					<Button
						variant="ghost"
						size="lg"
						onclick={() => (showConsentModal = false)}
						class="w-full font-bold"
					>
						{m.voice_consent_cancel()}
					</Button>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	@keyframes pulse-ring {
		0% {
			box-shadow: 0 0 0 0 oklch(0.505 0.213 27.518 / 0.4);
		}
		70% {
			box-shadow: 0 0 0 16px oklch(0.505 0.213 27.518 / 0);
		}
		100% {
			box-shadow: 0 0 0 0 oklch(0.505 0.213 27.518 / 0);
		}
	}
	.animate-pulse-ring {
		animation: pulse-ring 1.5s infinite;
	}
</style>
