# Realtime Session API (`/api/realtime-session`)

This SvelteKit server route (`+server.ts`) is responsible for securely generating **Ephemeral Tokens** for the OpenAI Realtime API. 

It keeps your `OPENAI_API_KEY` safely hidden on the backend, while generating a temporary token that allows the browser to establish a direct, low-latency audio connection with OpenAI.

## How to Use It

You don't need to manually `fetch` this API route. Instead, use the ready-made `createCookingSession` helper function exported from `src/lib/agent.ts` inside your Svelte components.

### 1. Connecting to the AI

```svelte
<script lang="ts">
  import { createCookingSession } from '$lib/agent';

  async function start() {
    // This automatically calls the backend, generates the token, and creates the WebRTC session
    const session = await createCookingSession();
  }
</script>

<button on:click={start}>Start Voice AI</button>
```

### 2. Passing a Custom System Prompt

If you want to inject dynamic knowledge or context into the AI's system prompt (for example, telling it what specific recipe the user has open), simply pass a string when you create the session!

```svelte
<script lang="ts">
  import { createCookingSession } from '$lib/agent';

  async function start() {
    // Inject dynamic system prompt instructions based on whatever the user is looking at
    const systemPrompt = "The user is currently making a spicy Pepperoni Pizza. Keep the instructions focused on the dough and toppings.";
    
    // Pass the custom prompt when you connect!
    const session = await createCookingSession(systemPrompt);
  }
</script>
```

When you pass that string, the frontend sends it via `POST` to this API route. The backend then safely appends your custom instructions to the AI's core personality ("You are a helpful culinary assistant...") before requesting the token from OpenAI.
