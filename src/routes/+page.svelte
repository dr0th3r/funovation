<script lang="ts">
	import { createCookingSession } from '$lib/agent';
	import type { RealtimeSession } from '@openai/agents/realtime';

	let session: RealtimeSession | null = $state(null);
	let isConnecting = $state(false);
	let errorMsg = $state('');

	async function startCookingAgent() {
		try {
			isConnecting = true;
			errorMsg = '';
			const customSystemPrompt = "The user is testing this locally. Ask them what they want to cook!";
			session = await createCookingSession(customSystemPrompt);
		} catch (error) {
			const err = error as Error;
			console.error("Failed to start session", err);
			errorMsg = err.message;
		} finally {
			isConnecting = false;
		}
	}

	function stopCookingAgent() {
		if (session) {
			// Often there is a close/disconnect method, or we can just drop the instance
			// Actually session.agent could be stopped, or WebRTC PC closed.
			// Let's just drop the reference for UI reset - garbage collection will drop the unreferenced WebRTC.
			session = null;
		}
	}
</script>

<div class="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center font-sans">
	<div class="max-w-md w-full bg-neutral-800 rounded-3xl shadow-2xl p-8 border border-neutral-700/50 text-center relative overflow-hidden">
		<!-- Dynamic blur background based on state -->
		<div class="absolute inset-0 bg-gradient-to-br {session ? 'from-green-500/10 to-teal-500/5' : 'from-blue-500/10 to-indigo-500/5'} blur-2xl z-0 transition-all duration-1000"></div>
		
		<div class="relative z-10">
			<h1 class="text-3xl font-bold mb-2 tracking-tight">Cooking Assistant</h1>
			<p class="text-neutral-400 mb-8 text-sm">Test the OpenAI Voice Agent via WebRTC</p>

			{#if errorMsg}
				<div class="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-xl mb-6 text-sm flex items-center text-left">
					<span class="mr-2">⚠️</span> {errorMsg}
				</div>
			{/if}

			{#if session}
				<div class="relative w-32 h-32 mx-auto mb-8">
					<div class="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
					<div class="relative h-full w-full bg-neutral-900 rounded-full flex items-center justify-center border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all">
						<span class="text-5xl drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">🎙️</span>
					</div>
				</div>
				<p class="text-green-400 mb-8 font-medium animate-pulse tracking-wide text-lg">Listening...</p>
				
				<button 
					class="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 font-semibold rounded-2xl transition-all shadow-[0_4px_20px_-10px_rgba(239,68,68,0.3)] hover:shadow-[0_4px_30px_-5px_rgba(239,68,68,0.4)] disabled:opacity-50"
					onclick={stopCookingAgent}>
					End Conversation
				</button>
			{:else}
				<div class="relative w-32 h-32 mx-auto mb-8 transition-transform hover:scale-105 duration-300">
					<div class="h-full w-full bg-neutral-900 rounded-full flex items-center justify-center border-2 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
						<span class="text-5xl opacity-80">🍳</span>
					</div>
				</div>
				
				<button 
					class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_10px_40px_-5px_rgba(79,70,229,0.7)] disabled:opacity-50 disabled:scale-95 disabled:grayscale relative overflow-hidden group"
					onclick={startCookingAgent}
					disabled={isConnecting}>
					
					<div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

					<span class="relative z-10 flex items-center justify-center">
						{#if isConnecting}
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Connecting...
						{:else}
							Start Voice Guide
						{/if}
					</span>
				</button>
			{/if}
		</div>
	</div>
</div>
