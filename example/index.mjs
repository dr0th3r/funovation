import WebSocket from 'ws';
import 'dotenv/config';
import readline from 'readline';
import { SYSTEM_PROMPT } from './system-prompt.mjs';
import { REALTIME_TOOLS, parseTimerArgs } from './tools.mjs';

/**
 * STANDALONE REALTIME COOKING ASSISTANT
 * 
 * Run with: node index.mjs
 */

const API_URL = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2025-06-03';
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    console.error('Error: OPENAI_API_KEY is missing in your .env file.');
    process.exit(1);
}

class CookingAssistant {
    constructor() {
        this.ws = null;
        this.handledCallIds = new Set();
        this.activeTimers = new Set();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async connect() {
        console.log('--- Connecting to OpenAI Realtime ---');
        
        this.ws = new WebSocket(API_URL, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "OpenAI-Beta": "realtime=v1",
            },
        });

        this.ws.on('open', () => {
            console.log('Connected! (WebSocket)');
            this.setupSession();
            this.startLoop();
        });

        this.ws.on('message', (data) => {
            const event = JSON.parse(data.toString());
            this.handleEvent(event);
        });

        this.ws.on('error', (err) => console.error('WebSocket Error:', err));
        this.ws.on('close', () => {
            console.log('Connection closed.');
            process.exit();
        });
    }

    setupSession() {
        const sessionUpdate = {
            type: 'session.update',
            session: {
                instructions: SYSTEM_PROMPT,
                modalities: ['text'], // Focusing on text for the terminal demo
                voice: 'alloy',
                tools: REALTIME_TOOLS,
                tool_choice: 'auto',
            },
        };
        this.send(sessionUpdate);
        
        // Initial greeting trigger
        this.sendUserMessage('hi');
    }

    handleEvent(event) {
        // Log basic event flow
        if (event.type === 'response.text.delta') {
            process.stdout.write(event.delta);
        } else if (event.type === 'response.text.done') {
            console.log('\n');
        } else if (event.type === 'response.function_call_arguments.done') {
            this.handleFunctionCall(event.name, event.call_id, event.arguments);
        } else if (event.type === 'response.output_item.done' && event.item?.type === 'function_call') {
            this.handleFunctionCall(event.item.name, event.item.call_id, event.item.arguments ?? '{}');
        } else if (event.type === 'error') {
            console.error('API Error:', event.error);
        }
    }

    scheduleReminder(reminderText, delaySeconds) {
        const timerId = setTimeout(() => {
            this.activeTimers.delete(timerId);
            console.log(`\n[Timer] ${reminderText}`);

            this.send({
                type: 'response.create',
                response: {
                    instructions: `Timer finished. Briefly remind the user now: ${reminderText}`
                },
            });
        }, delaySeconds * 1000);

        this.activeTimers.add(timerId);
    }

    async handleFunctionCall(name, callId, argsText) {
        if (!callId || this.handledCallIds.has(callId)) {
            return;
        }

        this.handledCallIds.add(callId);

        let args = {};
        try {
            args = argsText ? JSON.parse(argsText) : {};
        } catch {
            args = {};
        }

        let output;
        if (name === 'set_cooking_timer') {
            const parsed = parseTimerArgs(args);
            if (parsed.ok) {
                this.scheduleReminder(parsed.reminderText, parsed.delaySeconds);
                output = {
                    scheduled: true,
                    reminder_text: parsed.reminderText,
                    delay_seconds: parsed.delaySeconds,
                    fire_at: parsed.fireAtIso,
                };
            } else {
                output = {
                    scheduled: false,
                    error: parsed.error,
                };
            }
        } else {
            output = {
                scheduled: false,
                error: `Unknown tool: ${name}`,
            };
        }

        this.send({
            type: 'conversation.item.create',
            item: {
                type: 'function_call_output',
                call_id: callId,
                output: JSON.stringify(output),
            },
        });

        this.send({ type: 'response.create' });
    }

    send(event) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(event));
        }
    }

    sendUserMessage(text) {
        this.send({
            type: 'conversation.item.create',
            item: {
                type: 'message',
                role: 'user',
                content: [{ type: 'input_text', text }],
            },
        });
        this.send({ type: 'response.create' });
    }

    startLoop() {
        this.rl.on('line', (line) => {
            if (line.trim().toLowerCase() === 'exit') {
                this.activeTimers.forEach(clearTimeout);
                this.activeTimers.clear();
                this.ws.close();
                this.rl.close();
                return;
            }
            this.sendUserMessage(line);
        });
    }
}

const assistant = new CookingAssistant();
assistant.connect();
