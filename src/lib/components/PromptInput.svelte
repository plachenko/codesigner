<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    import SpeechRecognition from "./SpeechRecognition.svelte";
    import LoadButton from "./LoadButton.svelte";

    let promptEl = $state(null);
    let _prompt = $state("");
    let speechComp = $state(null);
    let { prompt, sendHandler, generating, handleSpeech } = $props();

    $effect(() => {
        console.log(prompt, "prompt");
        // prompt ? (_prompt = prompt) : (_prompt = "");
    });

    onMount(() => {
        focusInp();
    });

    export function focusInp() {
        if (promptEl) {
            promptEl.focus();
        }
    }

    function promptSendHandler() {
        sendHandler(_prompt);
    }
</script>

<div class="gap-1 flex w-full">
    <div class="pl-1 pr-[2px] flex-1 flex bg-white rounded-md gap-1">
        <div
            class="hover:cursor-text items-center hfull flex-1 overflow-x-scroll relative flex">
            <div
                onkeydown={(e) => {
                    switch (e.key) {
                        case "Enter":
                            e.preventDefault();
                            promptSendHandler();
                            break;
                    }
                }}
                role="textbox"
                tabindex="0"
                bind:innerHTML={_prompt}
                bind:this={promptEl}
                class="w-full absolute whitespace-nowrap z-[9999]"
                contenteditable>
            </div>
        </div>
        <div class="flex items-center">
            {#if _prompt}
                <button
                    transition:fade
                    onclick={() => {
                        _prompt = "";
                        focusInp();
                    }}
                    class="hover:bg-slate-400 bg-slate-400/40 text-sm"
                    >X</button>
            {/if}
        </div>
    </div>
    <div class="flex flex-row gap-1">
        <SpeechRecognition bind:this={speechComp} {handleSpeech} />
        {#if _prompt !== ""}
            <LoadButton
                btnDisabled={_prompt == "" || generating}
                loadText={"go"}
                loading={generating}
                {promptSendHandler} />
        {/if}
    </div>
</div>
