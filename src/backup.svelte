<script>
	// Define properties for the inputs
	import OpenAI from 'openai';

	let key = '';
	let openai = null;
	let prompt = '';
	let textContent = '';

  function connectHandler() {
		openai = new OpenAI({
			dangerouslyAllowBrowser: true,
			apiKey: key
		});
	}

	async function main(query = '', type = 0) {
		const chatCompletion = await openai?.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: !type
						? 'You are a helpful assistant.'
						: 'You always return json data as if you were an api.'
				},
				{ role: 'user', content: query }
			],
			model: 'gpt-4o'
		});

		return chatCompletion.choices[0].message;
	}


	function sendHandler() {
		main(prompt)
			.then((res) => {
				console.log(res.content);
				textContent = res.content;
			})
			.catch((err) => {
				console.log(err);
			});
	}
</script>

<div class="container">
	<div class="input-container">
		<input type="password" placeholder="API Key" bind:value={key} />
		<button on:click={sendHandler}>Connect</button>
		<input type="text" placeholder="Prompt" bind:value={prompt} />
		<button on:click={sendHandler}>Submit</button>
		<textarea readonly bind:value={textContent}></textarea>
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
