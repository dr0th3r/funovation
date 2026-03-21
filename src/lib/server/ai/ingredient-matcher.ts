import OpenAI from 'openai';

export const matchIngredientsWithAi = async (
	apiKey: string,
	userInput: string,
	dbIngredients: string[]
) => {
	if (!apiKey || !userInput || dbIngredients.length === 0) {
		return [] as string[];
	}

	const openai = new OpenAI({ apiKey });

	const response = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content: `Map the user's messy text to the exact ingredient names from this array: ${JSON.stringify(dbIngredients)}. Fix typos, translate synonyms, and match plurals to singulars. Respond ONLY with JSON object: {"matches":["Exact DB Item 1"]}. If no match, return {"matches":[]}.`
			},
			{ role: 'user', content: userInput }
		],
		response_format: { type: 'json_object' },
		temperature: 0.1
	});

	const raw = response.choices[0]?.message?.content ?? '{"matches":[]}';

	try {
		const parsed = JSON.parse(raw) as { matches?: string[] };
		if (!Array.isArray(parsed.matches)) {
			return [];
		}
		return parsed.matches;
	} catch {
		return [];
	}
};
