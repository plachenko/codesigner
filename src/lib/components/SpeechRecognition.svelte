<script lang="ts">
import { createEventDispatcher, onMount, onDestroy } from 'svelte';

let { text } = $props();

let recognition;
const dispatch = createEventDispatcher();
let isListening = false;

onMount(() => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support Speech Recognition API');
      return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    text = transcript;
    console.log('transcript', transcript)
  };

  recognition.onstart = () => {
    isListening = true;
    console.log('test')
  };

  recognition.onend = () => {
    isListening = false;
  };

});

onDestroy(() => {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
});

function toggleListening() {
  if (isListening) {
    recognition.stop();
  } else {
    recognition.start();
  }
}
</script>

<button class="bg-blue-400 text-white px-4 py-2 rounded" on:click={toggleListening}>
{#if isListening}
  Stop
{:else}
  Listen
{/if}
</button>

<style>
</style>
