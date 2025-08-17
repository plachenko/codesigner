<script>
    import ImageUpload from "./ImageUpload.svelte";
    import Terminal from "$lib/components/Terminal.svelte";
    import { fly } from "svelte/transition";
    // your script goes here
    let { parseCode, fsTerm, toggleTerm, showTerm, resp, parseMD } = $props();

    $effect(() => {
        console.log(fsTerm);
    });

    let historyEl = $state(null);
    let respSection = $state(null);
    let respCont = $state(null);
</script>

<div class="flex w-full h-full">
    <!-- <ImageUpload /> -->
    <div class="bg-slate-500/40 flex-1 flex-row relative overflow-hidden flex">
        {#if showTerm}
            <div transition:fly={{ x: -100 }} class="bg-black flex-1 relative">
                <button
                    onclick={() => {
                        toggleTerm();
                        fsTerm = !fsTerm;
                    }}
                    class="z-9999 text-2xl absolute right-1 top-1">⛶</button>
                <Terminal />
            </div>
        {/if}
        {#if !fsTerm && resp}
            <div
                bind:this={respSection}
                class="flex-1 flex relative overflow-y-scroll">
                <div
                    bind:this={respCont}
                    class="w-full h-full absolute top-0 p-3 text-sm">
                    {#if resp}
                        <div class="bg-slate-200 rounded-md w-full p-2">
                            {#if parseCode}
                                {@html parseMD(resp)}
                            {:else}
                                {@html resp}
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>

<!-- markup (zero or more items) goes here -->

<style>
    /* your styles go here */
</style>
