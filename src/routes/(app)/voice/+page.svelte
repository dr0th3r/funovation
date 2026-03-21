<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Button } from '$lib/components/ui/button';
	import Mic from '@lucide/svelte/icons/mic';
	import MicOff from '@lucide/svelte/icons/mic-off';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Timer from '@lucide/svelte/icons/timer';

	type Step = { id: number; title: string; description: string };
	type Ingredient = { id: number; name: string; amount: string };
	type ConnectionState = 'disconnected' | 'connecting' | 'connected';
	type ActiveTimer = { id: number; label: string; remaining: number };

	const recipe = { name: 'Kuřecí nudličky s rýží' };

	const steps: Step[] = [
		{
			id: 1,
			title: 'Oloupat brambory',
			description: 'Oloupejte brambory a nakrájejte na kostičky.'
		},
		{ id: 2, title: 'Uvařit rýži', description: 'Vařte rýži 15 minut v osolené vodě.' },
		{
			id: 3,
			title: 'Opéct kuře',
			description: 'Nakrájejte kuře na nudličky a opečte na oleji dozlatova.'
		},
		{ id: 4, title: 'Smíchat', description: 'Smíchejte rýži s kuřetem a dochuťte solí a pepřem.' }
	];

	const ingredients: Ingredient[] = [
		{ id: 1, name: 'Kuřecí prsa', amount: '300 g' },
		{ id: 2, name: 'Rýže', amount: '200 g' },
		{ id: 3, name: 'Olej', amount: '2 lžíce' },
		{ id: 4, name: 'Sůl', amount: 'podle chuti' },
		{ id: 5, name: 'Pepř', amount: 'podle chuti' }
	];

	let activeTab: 'steps' | 'ingredients' = $state('steps');
	let currentStep = $state(0);

	// Voice state
	let connectionState = $state<ConnectionState>('disconnected');
	let isAiSpeaking = $state(false);
	let isUserSpeaking = $state(false);
	let aiTranscript = $state('');
	let activeTimers = $state<ActiveTimer[]>([]);
	let errorMessage = $state('');

	// Non-reactive refs
	let pc: RTCPeerConnection | null = null;
	let dc: RTCDataChannel | null = null;
	let audioEl: HTMLAudioElement | null = null;
	let timerNextId = 0;
	const handledCallIds = new Set<string>();
	const timerIntervals = new Map<number, ReturnType<typeof setInterval>>();

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
				t.id === id ? { ...t, remaining: t.remaining - 1 } : t
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

			if (!reminderText || !Number.isInteger(delaySeconds) || delaySeconds < 5 || delaySeconds > 7200) {
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
					} else if (msg.type === 'response.output_item.done' && msg.item?.type === 'function_call') {
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

	const statusLabel = $derived(
		connectionState === 'connecting'
			? 'Connecting…'
			: connectionState === 'disconnected'
				? 'Tap the mic to start'
				: isUserSpeaking
					? 'Listening…'
					: isAiSpeaking
						? 'Speaking…'
						: 'Ready'
	);

	const micActive = $derived(connectionState === 'connected');
	const micPulsing = $derived(isAiSpeaking || isUserSpeaking);
</script>

<main class="flex w-xl flex-1 flex-col overflow-hidden">
	<div class="flex-1 overflow-y-auto px-5 pb-20">
		<h1 class="py-6 text-3xl leading-tight font-black tracking-tight text-foreground">
			{recipe.name}
		</h1>

		<!-- Timers -->
		{#if activeTimers.length > 0}
			<div class="mb-4 flex flex-wrap gap-2">
				{#each activeTimers as timer (timer.id)}
					<div
						class="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700"
					>
						<Timer class="size-3.5" />
						<span>{timer.label}</span>
						<span class="font-mono tabular-nums">{formatTime(timer.remaining)}</span>
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
				{#each steps as step, i}
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
							<h2 class="text-2xl font-bold text-primary">{step.title}</h2>
							{#if i === currentStep}
								<p class="mt-4 text-sm leading-relaxed text-secondary-foreground">
									{step.description}
								</p>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		{#if activeTab === 'ingredients'}
			<div class="flex flex-col">
				{#each ingredients as ing (ing.id)}
					<div class="flex justify-between border-b border-border py-4 text-sm">
						<span class="font-bold text-foreground">{ing.name}</span>
						<span class="font-medium text-muted-foreground">{ing.amount}</span>
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
				onclick={toggleConnection}
				disabled={connectionState === 'connecting'}
				aria-label={micActive ? 'Stop assistant' : 'Start assistant'}
				class="flex size-22 items-center justify-center rounded-full transition-all active:scale-95 disabled:opacity-50
					{micActive
					? 'bg-primary text-primary-foreground'
					: 'bg-secondary text-primary'}
					{micPulsing ? 'animate-pulse-ring' : ''}"
			>
				{#if connectionState === 'connecting'}
					<div class="size-6 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
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
			<Button
				variant="ghost"
				onclick={nextStep}
				disabled={currentStep === steps.length - 1}
				class="font-bold"
			>
				{m.voice_next()}<ChevronRight class="size-4" />
			</Button>
		</div>
	</div>
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
