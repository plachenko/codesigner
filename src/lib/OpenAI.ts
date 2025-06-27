import OpenAI from 'openai';
type OpenAIInstance = OpenAI | null;
type ChatCompletionResponse = {
	choices?: { message: { role: string; content: string } }[];
};

let openai: OpenAIInstance = null;

export function setKey(key: string) {
	openai = new OpenAI({
		dangerouslyAllowBrowser: true,
		apiKey: key
	});
}

export async function connect(key: string) {
	setKey(key);

	try {
		return chat('hello');
	} catch (err: any) {
		return new Error(err);
	}
}

export async function vision(query = 'What is in this image?', img: string | null = null) {
	const response = await openai?.chat.completions.create({
		model: 'gpt-4.1',
		messages: [
			{
				role: 'user',
				content: [
					{ type: 'text', text: query },
					{
						type: 'image_url',
						image_url: {
							url: img,
							detail: 'low'
						}
					}
				]
			}
		]
	});

	console.log(response);

	return response?.choices[0];
}

export async function chat(
	query: string = '',
	type: number = 0
): Promise<{ role: string; content: string } | undefined> {
	try {
		const chatCompletion: ChatCompletionResponse = await openai?.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						type === 0
							? 'You are a helpful assistant.'
							: 'You always return json data as if you were an api.'
				},
				{ role: 'user', content: query }
			],
			model: 'gpt-4o'
		});

		// Make sure the response is as expected
		if (chatCompletion?.choices && chatCompletion.choices.length > 0) {
			return chatCompletion.choices[0].message;
		}
	} catch (error) {
		throw new Error(error);
	}

	return undefined;
}
