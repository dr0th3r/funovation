export const REALTIME_TOOLS = [
    {
        type: 'function',
        name: 'set_cooking_timer',
        description: 'Schedules a cooking reminder after a short delay (for rice, onions, pasta, etc.).',
        parameters: {
            type: 'object',
            properties: {
                reminder_text: {
                    type: 'string',
                    description: 'What to remind the user about, for example: Check if onions are golden.'
                },
                delay_seconds: {
                    type: 'integer',
                    minimum: 5,
                    maximum: 7200,
                    description: 'How many seconds to wait before the reminder.'
                }
            },
            required: ['reminder_text', 'delay_seconds'],
            additionalProperties: false
        }
    }
];

export function parseTimerArgs(args = {}) {
    const reminderText = String(args.reminder_text ?? '').trim();
    const delaySeconds = Number(args.delay_seconds);

    if (!reminderText) {
        return { ok: false, error: 'reminder_text must be provided' };
    }

    if (!Number.isInteger(delaySeconds) || delaySeconds < 5 || delaySeconds > 7200) {
        return { ok: false, error: 'delay_seconds must be an integer between 5 and 7200' };
    }

    return {
        ok: true,
        reminderText,
        delaySeconds,
        fireAtIso: new Date(Date.now() + delaySeconds * 1000).toISOString()
    };
}
