<script lang="ts">
	import OpenAI from 'openai';
	type OpenAIInstance = OpenAI | null;
	type ChatCompletionResponse = {
		choices?: { message: { role: string; content: string } }[];
	};

	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import markedCodePreview from 'marked-code-preview';
	import SpeechRecognition from '$lib/components/SpeechRecognition.svelte';
	import Settings from '$lib/components/Settings.svelte';

  import CreateDisplay from '$lib/components/CreateDisplay.svelte';
	import RadialProgress from '$lib/components/RadialProgress.svelte';

	let key: string = $state('');
	let openai: OpenAIInstance = null;
	let prompt: string = $state('');
	let textContent: string = $state('');
	let codeSample: string = $state('');
	let fileInp = $state(null);

	let loading = $state(false);

	let imgMsg = $state('');
	let generated = $state(false);
	let keyvalid = $state(false);

	let generating = $state(false);

	onMount(() => {
		key = window.localStorage.getItem('key') || '';
		if (key !== '') {
			keyvalid = true;
			connectHandler();
		}
	});

	function handleSpeech(textResponse) {
		prompt = textResponse;
	}

	function handleGenerate(prompt) {
		loading = true;
		imgMsg = '';
		let fr = new FileReader();
		fr.readAsDataURL(fileInp[0]);
		fr.addEventListener('loadend', (e) => {
			vision(prompt + 'using the provided the design with ONLY the code', e?.currentTarget.result)
				.then((e) => {
					textContent = e.message.content;
					console.log(e);
					loading = false;
					generated = true;
					generating = false;
				})
				.catch((err) => {
					textContent = 'error.';
					console.log(err);
					loading = false;
					generating = false;
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
								url: img,
                detail: "low"
							}
						}
					]
				}
			]
		});
		return response.choices[0];
	}

	function countWords(text) {
		// Ensure the input is a string
		if (typeof text !== 'string') {
			return 0;
		}

		// Split the text by spaces and filter out empty strings
		const wordsArray = text
			.trim()
			.split(/\s+/)
			.filter((word) => word.length > 0);

		// Return the number of words
		return wordsArray.length;
	}

	function sendHandler(): void {
		generating = true;
		if (fileInp) {
			handleGenerate(`${prompt}${codeSample !== '' ? ':' : ''} ${codeSample}`);
		} else {
			main(`${prompt}${codeSample !== '' ? ':' : ''} ${codeSample}`)
				.then((res) => {
					if (res) {
						textContent = res.content;
					}
					generating = false;
				})
				.catch((err) => {
					console.error(err);
					generating = false;
				});
		}
	}
</script>

<div class="flex h-full flex-col sm:flex-row">
	<div class="flex-1 flex flex-col p-2 gap-4">
		{#if !keyvalid}
			<div class="flex w-full justify-center">
				<div class="w-full gap-2 flex flex-col justify-center">
					<div
						class="text-center bg-slate-200 border-2 rounded-md text-slate-500 p-3 border-slate-400"
					>
						<p>
							This is a design tool to help you generate code given a prompt and a design using the
							OpenAI Vision API as well as the ChatGPT-4o model.
						</p>
						<br />
						<p class="border-t-2 border-slate-300 border-dashed pt-4">
							Please make sure you have an <a
								class="underline underline-offset-2 font-bold"
								href="https://platform.openai.com/account/api-keys"
								target="_blank">OpenAI API key</a
							>
						</p>
					</div>
					<input
						required="required"
						type="password"
						placeholder="Enter an OpenAI API Key"
						bind:value={key}
					/>
					<button on:click={connectHandler}>Connect</button>
				</div>
			</div>
		{:else}
			<Settings />

			<div class="flex w-full gap-2 border-b-2 pb-3">
				<input type="text" placeholder="Prompt" bind:value={prompt} />
				<SpeechRecognition {handleSpeech} />
			</div>
			<div class="flex gap-3">
				<div class="flex flex-1 flex-col">
					<div class="flex items-center justify-center w-full gap-3">
            {#if fileInp}
              <button class="h-full" on:click={() => fileInp = null}>Remove</button>
            {/if}
						<label
							for="doc"
							class="flex items-center p-4 gap-3 rounded-md border-2 border-gray-300 border-dashed bg-gray-50 cursor-pointer w-full justify-center"
						>
							<div class="space-y-2 w-full text-center">
								<h4 class="text-base font-semibold text-gray-700">
									{#if !fileInp}
										Upload a design
									{:else}
										{fileInp[0].name}
									{/if}
								</h4>

								<!-- <h4 class="text-base font-semibold text-gray-700">{#if !fileInp.length}Upload a file{:else}{fileInp[0].name}{/if}</h4> -->
							</div>
							<input
								type="file"
								id="doc"
								name="doc"
								accept="png, jpg"
								bind:files={fileInp}
								hidden
							/>
						</label>
					</div>
				</div>
				<div class="flex items-center relative justify-center">
					<span class="bg-white z-10">or</span>
					<div class="h-full border-r-2 border-slate-200 absolute"></div>
				</div>
				<button popovertarget="createPopover">Create</button>
        <CreateDisplay />
      </div>

			<textarea
				bind:value={codeSample}
				class="h-full flex-1"
				style="resize: none"
				placeholder="Enter a Code Sample to adhere to (optional)"
			></textarea>
			<button
				disabled={prompt == '' || generating}
				on:click={sendHandler}
				class="justify-center flex"
			>
				{#if !generating}
					Generate
				{:else}
					<RadialProgress meter={'#FF3E00'} />
				{/if}
			</button>
		{/if}
	</div>
	{#if keyvalid}
		<div class="flex-1 p-2 flex flex-col gap-4">
			<div class="border-2 h-full w-full rounded-md p-3 overflow-y-auto overflow-x-hidden">
				{@html marked.use({ gfm: true }).use(markedCodePreview()).parse(textContent)}
			</div>
			{#if textContent}
				<div class="flex-end p-2 pb-3">
					<span class="bg-slate-200 text-slate-400 p-2 rounded-md"
						>Word Count: {countWords(textContent)}</span
					>
				</div>
			{/if}
		</div>
	{/if}
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

	input:user-valid {
		border-color: green;
	}
	textarea {
		height: 200px;
		resize: vertical;
	}

	button:disabled {
		opacity: 0.5;
		cursor: default;
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

	#settingsPopover::backdrop {
		@starting-style {
			opacity: 0;
		}
		background-color: #000;
		opacity: 0.6;
		transition:
			opacity 0.3s,
			display 0.3s allow-discrete;
	}

	#settingsPopover {
		&:popover-open {
			@starting-style {
				transform: translateY(10px);
				opacity: 0;
			}

			transform: translateY(0);
			opacity: 1;
		}

		transform: translateY(10px);
		opacity: 0;

		transition:
			transform 0.3s,
			opacity 0.3s,
			display 0.3s allow-discrete;
	}
</style>
