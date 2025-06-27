<script lang="ts">
    import RadialProgress from "$lib/components/RadialProgress.svelte";

    const {
        btnDisabled,
        loading,
        loadText,
        sendHandler,
    }: {
        btnDisabled: boolean;
        loading: boolean;
        loadText: string;
        sendHandler: () => void;
    } = $props();
</script>

<button
    disabled={btnDisabled || false}
    onclick={sendHandler}
    class="
    justify-center
    flex
    ">
    {#if !loading}
        {loadText}
    {:else}
        <RadialProgress meter={"#FF3E00"} />
    {/if}
</button>
