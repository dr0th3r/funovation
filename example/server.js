import express from 'express';
import 'dotenv/config';
import { SYSTEM_PROMPT } from './system-prompt.mjs';
import { REALTIME_TOOLS } from './tools.mjs';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/session', async (req, res) => {
    try {
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                voice: "alloy",
                instructions: SYSTEM_PROMPT,
                tools: REALTIME_TOOLS,
                tool_choice: "auto",
            }),
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
