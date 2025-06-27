<script lang="ts">
    import { onMount } from "svelte";

    let { socket } = $props();

    let term = $state(null);
    let xterm = $state(null);
    let xtermCont = $state(null);

    $effect(() => {
        if (socket) {
            socket.send("hi");
            socket.addEventListener("message", (e) => {
                try {
                    let data = JSON.parse(e.data);
                    term.write(data.message.content);
                    console.log("terminal", term, data.message.content);
                } catch (e) {
                    console.log("error parsing JSON");
                }
            });
        }
    });

    onMount(async () => {
        setTimeout(async () => {
            xterm = await import("@xterm/xterm");

            const { FitAddon } = await import("xterm-addon-fit");
            const fit = new FitAddon();
            term = new xterm.Terminal();
            term.loadAddon(fit);
            fit.fit();

            term.open(xtermCont);
            term.onData((e) => {
                term.write(e);
            }, 1400);
        });
    });
</script>

<div>
    <div>
        <div bind:this={xtermCont} class="p-1 w-full h-full absolute"></div>
    </div>
</div>
