<script lang="ts">
    import { setKey, chat, vision } from "$lib/OpenAI";
    import { onMount } from "svelte";

    import MidSection from "$lib/components/MidSection.svelte";

    import { marked } from "marked";
    import markedCodePreview from "marked-code-preview";
    import markedKatex from "marked-katex-extension";

    import { fade, fly } from "svelte/transition";

    import KeyInput from "$lib/components/KeyInput.svelte";
    import PromptInput from "$lib/components/PromptInput.svelte";
    import Terminal from "$lib/components/Terminal.svelte";

    import LoadButton from "$lib/components/LoadButton.svelte";
    import RadialProgress from "$lib/components/RadialProgress.svelte";
    import SpeechRecognition from "$lib/components/SpeechRecognition.svelte";
    import HistoryList from "$lib/components/HistoryList.svelte";

    let key = $state("");
    let keyValid = $state(false);
    let appear = $state(false);

    let promptDiv = $state(null);

    let showTerm = $state(true);
    let fsTerm = $state(false);

    let promptEl = $state(null);
    let resp = $state("");
    let generating = $state(false);
    let respCont = $state(null);
    let respSection = $state(null);

    let speechComp = $state(null);
    let parseCode = $state(true);

    let historyArray = $state([]);
    let historyNum = $state(null);
    let historyEl = $state(null);

    let socket = $state();

    onMount(async () => {
        const wsURL = `ws://${window.location.host}/ws`;
        socket = new WebSocket(wsURL);

        setTimeout(() => {
            socket.send("test");
        }, 300);

        setTimeout(() => {
            appear = true;
        }, 100);

        window.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "KeyZ":
                    if (e.altKey) {
                        speechComp.toggleListening();
                    }
                    break;
            }
        });

        readHistory();

        key = window.localStorage.getItem("key") || "";
        if (key !== "") {
            keyValid = true;
        }
        setKey(key);
    });

    function handleSpeech(textResponse: string) {
        prompt = textResponse;
        sendHandler(prompt);
    }

    function parseMD(text) {
        let ret = text;

        if (ret)
            ret = marked.use({ gfm: true }).use(markedCodePreview).parse(text);

        return ret;
    }

    function saveHistory() {
        window.localStorage.setItem(
            "historyArray",
            JSON.stringify(historyArray),
        );
    }

    function resetHistory() {
        historyArray = new Array();
        prompt = "";
        resp = "";
        saveHistory();
    }

    function setHistory(idx) {
        respSection.scrollTop = 0;
        prompt = historyArray[idx].prompt;
        resp = historyArray[idx].resp;
        historyNum = idx;
    }

    function readHistory() {
        historyArray =
            JSON.parse(window.localStorage.getItem("historyArray")) || [];
    }

    async function sendHandler(prompt) {
        generating = true;

        chat(`${prompt}`)
            .then((e) => {
                resp = e?.content || "";
                respCont.scrollTo(0, 0);
                historyArray.push({ prompt, resp });
                historyNum = historyArray.length - 1;
                saveHistory();
                prompt = "";
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                generating = false;
            });
    }

    function connectHandler(keyVal: string): void {
        keyValid = true;
        window.localStorage.setItem("key", keyVal);
    }
</script>

<div class="w-full h-full flex flex-col bg-slate-500">
    {#if appear}
        <div class="w-full h-full" transition:fade>
            {#if !keyValid}
                <KeyInput {key} {connectHandler} />
            {:else}
                <div class="h-full flex flex-col w-full">
                    {#if !fsTerm}
                        <div class="bg-slate-400 p-2">
                            {#if resp}
                                <div class="flex flex-row w-full">
                                    <div class="w-[65px] pr-2">
                                        <button
                                            class="h-full w-full"
                                            onclick={() => {
                                                resp = null;
                                            }}>+</button>
                                    </div>
                                    <div
                                        class="flex items-center text-slate-300 italic flex-1 border-l-2 pl-2 text-2xl">
                                        <div
                                            class="relative select-none bg-slate-100 p-1 rounded-md w-full">
                                            {prompt}
                                            <button
                                                class="text-xs absolute right-1"
                                                onclick={() => {
                                                    resp = null;
                                                }}>✏️</button>
                                        </div>
                                    </div>
                                </div>
                            {:else}
                                <PromptInput
                                    bind:this={promptDiv}
                                    {prompt}
                                    {handleSpeech}
                                    {sendHandler}
                                    {generating} />
                            {/if}
                        </div>
                    {/if}

                    <div class="flex h-full flex-1 bg-slate-200 relative">
                        {#if !fsTerm}
                            <div class="h-full p-1 gap-1 flex flex-col">
                                <button
                                    class="shrink"
                                    onclick={() => {
                                        showTerm = !showTerm;
                                    }}>
                                    term
                                </button>
                                <div
                                    class="w-full flex-1 relative overflow-hidden">
                                    <div
                                        class="absolute h-full w-full left-0 top-0">
                                        <HistoryList
                                            bind:this={historyEl}
                                            {setHistory}
                                            {resetHistory}
                                            {historyArray} />
                                    </div>
                                </div>
                            </div>
                        {/if}
                        <MidSection
                            {socket}
                            {parseCode}
                            {fsTerm}
                            {showTerm}
                            {resp}
                            {parseMD} />
                    </div>
                    <!--
-->

                    <!--
                    <div
                        class="z-[9999] rounded-md relative w-full h-full bg-slate-300 overflow-y-auto">
                        <div class="flex flex-row h-full relative">

                            <div class="w-full h-full flex flex-row">

                                {#if !fsTerm}
                                    <div class="flex-1 flex flex-col">
                                        <div
                                            class="bg-slate-200 border-b-2 flex gap-1 p-1">
                                            <button
                                                onclick={() => {
                                                    historyArray.splice(
                                                        historyNum,
                                                        1,
                                                    );
                                                    console.log(
                                                        "removing...",
                                                        historyArray[
                                                            historyNum
                                                        ],
                                                        historyNum,
                                                    );
                                                }}
                                                class="cursor-pointer select-none bg-slate-400 p-1 rounded-md">
                                                remove
                                            </button>
                                            <button
                                                class="flex items-center"
                                                onclick={() => {
                                                    parseCode = !parseCode;
                                                }}>parse: {parseCode}</button>
                                        </div>

                                        <div
                                            class="flex-1 bg-slate-300 relative overflow-auto">
                                            <div
                                                bind:this={respCont}
                                                class="absolute top-0 p-3 text-sm">
                                                {#if parseCode}
                                                    {@html parseMD(resp)}
                                                {:else}
                                                    {@html resp}
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                    -->
                </div>
            {/if}
        </div>
    {/if}
</div>
