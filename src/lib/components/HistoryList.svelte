<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";

    let { historyArray, resetHistory, setHistory, fsTerm } = $props();
    let curHist = $state(null);
    let historyTick = $state(null);
    let historyTickInt = $state(0);

    let outerEl = $state(null);
    let historyEl = $state(null);

    let show = $state(false);

    export function toggleShow() {
        show = !show;
    }

    function scrollUp() {
        // console.log(outerEl.offsetHeight);
        // outerEl.scrollTop = 0;
        // outerEl.scrollTo(0 );
    }

    onMount(() => {
        historyTickInt = historyArray.length;
        setTimeout(() => {
            show = true;
            historyTickInt = 0;

            // historyTick = setInterval(() => {
            //     if (historyTickInt >= 0) historyTickInt--;
            // }, 150);
        }, 400);
        // outerEl.scrollTop=0;

        /*
        setTimeout(() => {
            scrollUp();
        }, 1500);
        */
    });
</script>

{#if show}
    <div
        bind:this={outerEl}
        transition:fly={{ x: -10 }}
        class="w-full select-none h-full box-border flex flex-col-reverse gap-1 p-1">
        {#if historyArray.length}
            <button
                tabindex="0"
                onclick={resetHistory}
                class="rounded-md bg-blue-400/30 hover:bg-blue-400/70 font-bold h-[24px] text-white cursor-pointer font-white flex py-0 justify-center place-center">
                🗑️
            </button>
            <div
                class={`pl-2 leftScroll w-full h-full relative overflow-y-auto overflow-x-hidden flex gap-1 flex-col`}>
                {#each historyArray as item, idx}
                    {#if historyTickInt <= idx}
                        <div class="flex justify-center items-center">
                            <div
                                class={`${curHist == idx ? "opacity-100 h-[20px] rounded-md" : "opacity-20"} bg-blue-400 size-[12px] rounded-full absolute left-[-5px]`}>
                            </div>
                            <button
                                onclick={() => {
                                    setHistory(idx);
                                    curHist = idx;
                                }}
                                class={`${idx == curHist ? "font-bold bg-blue-400 hover:bg-blue-600" : "hover:bg-blue-400/40"}  cursor-pointer rounded-sm w-full min-h-[30px] p-1 flex justify-center items-center bg-blue-300`}>
                                {idx}
                            </button>
                        </div>
                    {/if}
                {/each}
                <button
                    onclick={() => {
                        setHistory(-1);
                    }}
                    class="border-dashed hover:bg-blue-400/70 border-2 bg-blue-400/50 border-blue-400"
                    >+</button>
            </div>
        {:else}
            <div
                class="bg-blue-300/40 flex items-center text-xs font-bold text-blue-400 text-center h-full text-2xs rounded-md w-full h-full p-2 border-blue-400 border-dashed border-2">
                Prompt History
            </div>
        {/if}
    </div>
{/if}

<!--
<div
    transition:fly={{ x: -20 }}
    class="bg-slate-400 overflow-auto w-[50px] h-full flex border-r-2 relative">
    <div class="flex-1">
        <button
            onclick={() => {
                historyArray = new Array();
            }}
            transition:fly={{ y: -10 }}>X</button>
    </div>
    <div class="relative">
        <div class="flex flex-col w-full flex-1 absolute">
            {#each historyArray as itm, idx}
                <div class="flex justify-center p-1 relative flex-1 w-full">
                    <button
                        class={`${idx == historyNum ? "border-2 border-white box-border" : "border-0"}`}
                        onclick={() => {
                            historyNum = idx;
                            prompt = itm.prompt;
                            resp = itm.resp;
                        }}
                        transition:fly={{
                            x: 20,
                        }}>{idx}</button>
                </div>
            {/each}
        </div>
    </div>
</div>
-->
<style>
    .leftScroll {
        direction: rtl;
    }
</style>
