<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { setKey, chat, vision } from '$lib/OpenAI';

	import markedCodePreview from 'marked-code-preview';
	import SpeechRecognition from '$lib/components/SpeechRecognition.svelte';
	import Settings from '$lib/components/Settings.svelte';
	import KeyInput from '$lib/components/KeyInput.svelte';
	import CreateDisplay from '$lib/components/CreateDisplay.svelte';
	import LoadButton from '$lib/components/LoadButton.svelte';

	let key: string = $state('');
	let prompt: string = $state('');
	let textContent: string = $state('hi');
	let codeSample: string = $state('');
	let fileInp = $state(null);
	let popoverOpen = $state(false);
	let loading = $state(false);
	let pageLoaded = $state(false);
	let imgMsg = $state('');
	let generated = $state(false);
	let keyvalid = $state(false);
	let generating = $state(false);
	let copied = $state(false);
	let xterm;
	let showResp = $state(false);
	let xtermCont;

	onMount(async () => {
		xterm = await import('@xterm/xterm');
		const term = new xterm.Terminal();

		document.addEventListener('keyup', (e) => {});

		setTimeout(() => {
			//term.open(xtermCont);
			term.writeln('hi');
			term.onData((e) => {
				term.writeln(e);
			});
		}, 100);

		document.addEventListener('keydown', (e) => {});

		key = window.localStorage.getItem('key') || '';
		if (key !== '') {
			keyvalid = true;
			setKey(key);
		}
		pageLoaded = true;
	});

	function parseMD() {
		return marked.use({ gfm: true }).use(markedCodePreview()).parse(textContent);
	}

	function handleSpeech(textResponse: string) {
		prompt = textResponse;
	}

	async function copyText() {
		try {
			if (copied) return;
			await navigator.clipboard.writeText(parseMD());
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 1000);
		} catch (err) {
			console.error('Fallback: Oops, unable to copy', err);
		}
	}

	function popoverOpenEvt(e: boolean) {
		popoverOpen = e;
	}

	function handleGenerate(prompt: string) {
		loading = true;
		imgMsg = '';

		let fr = new FileReader();
		fr.readAsDataURL(fileInp[0]);
		fr.addEventListener('loadend', (e) => {
			vision(
				prompt + 'using the provided the design with ONLY the code',
				e?.currentTarget.result
			)
				.then((e) => {
					textContent = e.message.content;
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

	function connectHandler(keyVal: string): void {
		keyvalid = true;
		window.localStorage.setItem('key', keyVal);
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

	async function sendHandler(): void {
		generating = true;

		if (fileInp) {
			handleGenerate(`${prompt}${codeSample !== '' ? ':' : ''} ${codeSample}`);
		} else {
			chat(`${prompt}${codeSample !== '' ? ':' : ''} ${codeSample}`)
				.then((res) => {
					if (res) {
						textContent = res.content;
						showResp = true;
					}
				})
				.catch((err) => {
					console.error(err);
				})
				.finally(() => {
					generating = false;
				});
		}
	}
</script>

<div
	inert={popoverOpen}
	class={`
    flex
    h-full
    flex-col
    sm:flex-row
    ${!pageLoaded ? 'hidden' : ''}
    `}
>
	{#if textContent.length && showResp}
		<div class="gap-1 absolute top-0 flex flex-col bg-wshite p-1 w-full h-full z-[9998]">
			<!--

-->
			<div class="flex-1 bg-red-400 flex">
				<div class="relative flex-1 top-0 left-0 border-box w-full h-full overflow-hidden">
					<div class="w-full h-full">
						<div
							class="absolute w-[70px] rounded-md h-[20px] z-[9999] absolute cursor-pointer top-[0px]"
						>
							<button
								on:click={copyText}
								class={`${copied ? 'bg-slate-600 text-slate-300 font-bold' : ''} z-[9999] select-none  bg-slate-200 border-2 border-slate-400 rounded-md px-2 ml-2`}
								>{copied ? 'Copied' : 'Copy'}</button
							>
							{#if copied}
								<div
									class="absolute top-[0px] left-[10px] z-[9995] animate-ping w-full h-full bg-red-400"
								/>
							{/if}
						</div>

						<div class="absolute p-1 h-full w-full overflow-y-auto">
							<div
								class="border-2 bg-slate-200 h-full w-full rounded-md p-3 overflow-y-auto overflow-x-hidden"
							>
								{@html parseMD()}
								<!-- {textContent} -->
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="w-full h-[40px]">
				<button
					class="w-full"
					on:click={() => {
						showResp = false;
					}}>back</button
				>
			</div>
		</div>
	{:else}
		<div
			class="
        flex-1
        flex
        flex-col
        p-2
        gap-4
        "
		>
			{#if !keyvalid}
				<KeyInput {key} {connectHandler} />
			{:else}
				<!--
			<Settings
                {popoverOpenEvt}
                />
            -->
				<div class="flex w-full gap-2 border-b-2 pb-3">
					<div class="relative flex w-full">
						<div
							autofocus
							contenteditable
							on:keydown={(e) => {
								switch (e.key) {
									case 'c':
										if (!textContent) return;
										copyText();
										break;
									case 'Enter':
										e.preventDefault();
										sendHandler();

										break;
								}
							}}
							bind:textContent={prompt}
							class="p-2 pr-[20px] overflow-x-auto whitespace-nowrap w-[300px] h-full bg-slate-100 border-slate-400 border-2 rounded-md"
						></div>
						<!--
					<input
						autofocus
						type="text"
						class="pr-10"
						placeholder="Prompt"
						bind:value={prompt}
					/>
                    -->
						<button
							on:click={() => (prompt = '')}
							class="
                        absolute
                        border-l-2
                        border-slate-300
                        right-0
                        rounded-r-0
                        h-full
                        top-0
                        enabled:hover:bg-slate-500/20
                        bg-transparent
                        text-slate-500
                        "
						>
							x
						</button>
					</div>
					<SpeechRecognition {handleSpeech} />
				</div>

				<div class="flex gap-3">
					<div class="flex flex-1 flex-col">
						<div class="flex items-center justify-center w-full gap-3">
							{#if fileInp}
								<button class="h-full" on:click={() => (fileInp = null)}
									>Remove</button
								>
							{/if}
							<label
								for="doc"
								class="
                            flex
                            items-center
                            p-4
                            gap-3
                            rounded-md
                            border-2
                            border-gray-300
                            border-dashed
                            bg-gray-50
                            cursor-pointer
                            w-full
                            justify-center
                            "
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
					<CreateDisplay {popoverOpenEvt} />
				</div>

				<div bind:this={xtermCont}></div>

				<textarea
					bind:value={codeSample}
					class="h-full flex-1"
					style="resize: none"
					placeholder="Enter a Code Sample to adhere to (optional)"
				></textarea>
				<LoadButton
					btnDisabled={prompt == '' || generating}
					loadText={'Generate'}
					loading={generating}
					{sendHandler}
				/>
			{/if}
		</div>
	{/if}
	<!--
	{#if textContent}
		<div class="flex-1 p-2 flex flex-col gap-4">
			<div class="relative">
				<span
					on:click={copyText}
					class="absolute cursor-pointer top-[-13px] bg-slate-200 border-2 border-slate-400 rounded-md px-2 ml-2"
					>Copy</span
				>
				<div
					class="border-2 h-full w-full rounded-md p-3 overflow-y-auto overflow-x-hidden"
				>
					{@html parseMD()}
				</div>
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
-->
</div>

<style>
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
