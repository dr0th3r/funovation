import { env } from '$env/dynamic/private';
import { json, type RequestEvent } from '@sveltejs/kit';
import OpenAI from 'openai';

export async function POST({ request }: RequestEvent) {
	const openai = new OpenAI({
		apiKey: env.OPENAI_API_KEY
	});

	try {
		const body = await request.json().catch(() => ({}));
		const userInstructions = body.instructions || '';
		const baseInstructions = 'You are a helpful culinary assistant guiding the user through cooking steps.';
		
		const finalInstructions = userInstructions 
			? `${baseInstructions}\n\nAdditional Context:\n${userInstructions}`
			: baseInstructions;

		// Request an ephemeral token from OpenAI using the official SDK
		const session = await openai.beta.realtime.sessions.create({
			model: 'gpt-4o-realtime-preview-2024-12-17',
			voice: 'verse', 
			instructions: finalInstructions
		});

		// Send the ephemeral session data back to the client
		return json(session);
	} catch (error: unknown) {
		const err = error as any;
		// Log the full error to the terminal for the user to see exactly what's failing (Quota, API Key, etc.)
		console.error("--- OpenAI SESSION ERROR ---");
		if (err.response) {
			console.error("Status:", err.status);
			console.error("Data:", err.response);
		} else {
			console.error("Message:", err.message);
		}
		console.error("----------------------------");

		return json(
			{ error: 'Failed to generate token', details: err.message }, 
			{ status: err.status || 500 }
		);
	}
}
