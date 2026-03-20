import { env } from '$env/dynamic/private';
import { json, type RequestEvent } from '@sveltejs/kit';
import OpenAI from 'openai';

export async function POST({ request }: RequestEvent) {
	const openai = new OpenAI({
		apiKey: env.OPENAI_API_KEY
	});

	try {
		// Ensure request is consumed if needed, though not currently used for token generation
		await request.json().catch(() => ({}));
		console.log("🔷 [SERVER] POST /api/realtime-session received");

		// Request an official ephemeral token from OpenAI securely on the backend
		const session = await openai.beta.realtime.sessions.create({
			model: 'gpt-4o-realtime-preview-2024-12-17',
			voice: 'verse', 
			modalities: ['audio', 'text'], // Explicitly set to ensure WebRTC audio support
			instructions: 'You are a helpful assistant.'
		});

		// Return the official session object which contains the ephemeral client_secret
		console.log("✅ [SERVER] Ephemeral session created successfully");
		return json(session);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("❌ [SERVER] OpenAI Session Error:", errorMessage);
		return json(
			{ error: 'Failed to generate token', details: errorMessage }, 
			{ status: 500 }
		);
	}
}
