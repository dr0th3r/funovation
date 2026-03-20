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

		// Request an official ephemeral token using the latest 'gpt-realtime' model
		const session = await openai.beta.realtime.sessions.create({
			model: 'gpt-realtime' as any,
			voice: 'marin', 
			modalities: ['audio', 'text'],
			instructions: `
# Role & Objective
You are a helpful and concise assistant. Your goal is to provide clear, brief support to the user.

# Personality & Tone
- Friendly, calm, and approachable.
- Tone: Warm, concise, and confident.
- Length: Keep responses to 1-2 short sentences.

# Instructions / Rules
- IF THE USER'S AUDIO IS UNCLEAR, ASK FOR CLARIFICATION.
- SPEAK CLEARLY AND BRIEFLY.
- CONFIRM UNDERSTANDING BEFORE TAKING ACTIONS.
			`.trim()
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
