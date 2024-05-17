<script lang="ts">
	import OpenAI from 'openai';
	type OpenAIInstance = OpenAI | null;
	type ChatCompletionResponse = {
		choices?: { message: { role: string; content: string } }[];
	};

	import { onMount } from 'svelte';
	import { marked } from 'marked';
  import markedCodePreview from 'marked-code-preview'
	import SpeechRecognition from '$lib/components/SpeechRecognition.svelte';

	let key: string = '';
	let openai: OpenAIInstance = null;
	let prompt: string = '';
	let textContent: string = '';
	let codeSample: string = '';
	let fileInp = null;

	let loading = false;

	let imgMsg = '';
	let imgPrompt = '';
	let generated = false;
	let keyvalid = false;

	onMount(() => {
		key = window.localStorage.getItem('key') || '';
		if (key !== '') {
			keyvalid = true;
			connectHandler();
		}
	});

  function handleSpeech(event) {
		console.log('Recognized speech:', event.detail.transcript);
    console.log(event)
    prompt = event.detail.transcript;
	}


	function handleGenerate(prompt) {
		loading = true;
		imgMsg = '';
		let fr = new FileReader();
		fr.readAsDataURL(fileInp[0]);
		fr.addEventListener('loadend', (e) => {
			vision(prompt, e?.currentTarget.result)
				.then((e) => {
					textContent = e.message.content;
					loading = false;
					generated = true;
				})
				.catch((err) => {
					textContent = 'error.';
					console.log(err);
					loading = false;
				});
		});

		fr.addEventListener('error', (err) => {
			console.log(err);
		});
	}

	function connectHandler(): void {
		openai = new OpenAI({
			dangerouslyAllowBrowser: true,
			apiKey: key
		});
		keyvalid = true;
		window.localStorage.setItem('key', key);
	}

	async function main(
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
			keyvalid = false;
			console.error(error);
			key = '';
		}
		window.localStorage.setItem('key', key);
		return undefined;
	}

	export async function vision(query = 'What is in this image?', img = null) {
		const response = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'user',
					content: [
						{ type: 'text', text: query },
						{
							type: 'image_url',
							image_url: {
								url:
									img ||
									'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg'
							}
						}
					]
				}
			]
		});
		return response.choices[0];
	}

  function text(e){
    console.log(e);
  }

  function countWords(text) {
    // Ensure the input is a string
    if (typeof text !== 'string') {
        return 0;
    }

    // Split the text by spaces and filter out empty strings
    const wordsArray = text.trim().split(/\s+/).filter(word => word.length > 0);

    // Return the number of words
    return wordsArray.length;
}


	function sendHandler(): void {
		if (fileInp) {
			handleGenerate(`${prompt}${codeSample !== '' ? ':' : ''} ${codeSample}`);
		} else {
			main(`${prompt}${codeSample !== '' ? ':' : ''} ${codeSample}`)
				.then((res) => {
					if (res) {
						textContent = res.content;
					}
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}
</script>

<div class="flex h-full">
	<div class="flex-1 flex flex-col p-2 gap-4">
		{#if !keyvalid}
    <input type="password" placeholder="API Key" bind:value={key} />
    <button on:click={connectHandler}>Connect</button>
		{/if}

    <div class="flex w-full gap-2">
      <input type="text" placeholder="Prompt" bind:value={prompt} />
      <SpeechRecognition {text} />
    </div>

		<input type="file" bind:files={fileInp} />

		<textarea
			bind:value={codeSample}
			class="h-full flex-1"
			style="resize: none"
			placeholder="Code Sample"
		></textarea>
		<button on:click={sendHandler}>Submit</button>
	</div>
	<div class="flex-1 p-2 flex flex-col gap-4">
		<div class="border-2 h-full w-full rounded-md p-3 overflow-y-auto overflow-x-hidden">
			{@html marked.use(markedCodePreview).parse(textContent)}
		</div>
    {#if textContent}
    <div class="flex-end p-2 pb-3">
      <span class="bg-slate-200 text-slate-400 p-2 rounded-md">Word Count: {countWords(textContent)}</span>
    </div>
    {/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		padding: 16px;
		background-color: #f8f9fa;
	}

	.input-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		max-width: 400px;
		margin-bottom: 20px;
	}

	input,
	textarea {
		width: 100%;
		padding: 10px;
		border: 2px solid #ced4da;
		border-radius: 4px;
		font-size: 16px;
	}

	textarea {
		height: 200px;
		resize: vertical;
	}

	button {
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		background-color: #007bff;
		color: white;
		font-size: 16px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}
</style>
