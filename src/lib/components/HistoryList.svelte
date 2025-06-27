<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";

    let { historyArray, resetHistory, setHistory } = $props();
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
        console.log(outerEl.offsetHeight);
        outerEl.scrollTop = 0;
        // outerEl.scrollTo(0 );
    }

    onMount(() => {
        historyTickInt = historyArray.length;
        setTimeout(() => {
            show = true;
            historyTick = setInterval(() => {
                if (historyTickInt >= 0) historyTickInt--;
            }, 150);
        }, 400);

        setTimeout(() => {
            scrollUp();
        }, 1500);
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
                class="rounded-md bg-blue-400 font-bold h-[24px] text-white cursor-pointer font-white flex py-0 justify-center place-center">
                X
            </button>
        {/if}
        <div
            class={`${outerEl?.offsetHeight < historyArray.length * 2 ? "pl-2" : ""} leftScroll w-full h-full relative overflow-auto flex gap-1 flex-col`}>
            {#each historyArray as item, idx}
                {#if historyTickInt <= idx}
                    <button
                        transition:fly={{
                            x: 10,
                        }}
                        onclick={() => {
                            setHistory(idx);
                            curHist = idx;
                        }}
                        class={`${idx == curHist ? "border-2 font-bold bg-blue-400" : "border-none"} hover:bg-blue-400/40 cursor-pointer rounded-sm w-full min-h-[30px] p-1 flex justify-center items-center bg-blue-300`}>
                        {idx}
                    </button>
                {/if}
            {/each}
        </div>
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
