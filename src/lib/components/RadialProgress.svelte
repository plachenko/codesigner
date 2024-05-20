<script lang="ts">
    import { onMount } from 'svelte';
    import gsap from 'gsap';

    export let value = undefined;
    export let track = 'rgb(240, 230, 200)';
    export let meter = `theme('bg.slate.900')`;
    export let baseBar = 20;

    let progressMeter: HTMLElement;
    let progressEl: HTMLElement;
    let progressInner: HTMLElement;

    let size = 30;

    onMount(() => {

        gsap.from(progressMeter, {
          ease: 'bounce.in',
          duration: 1,
          width: '0px',
          height: '0px'
        });

        gsap.from(progressInner, {
          ease: 'bounce.out',
          duration: 1,
          width: '0px',
          height: '0px'
        });

        if(value == undefined){
            gsap.to(progressMeter, {
                ease: 'none',
                rotation: '360deg',
                duration: 1,
                repeat: -1
            });
        }
    });
</script>


<div
    bind:this={progressEl}
    class={`
    size-[${size}px]
    rounded-full
    flex
    items-center
    justify-center
    relative
    `}>
    <div
        bind:this={progressMeter}
        style={`
        background: conic-gradient(
            ${meter} ${value !== undefined ? value : baseBar}%,
            ${track} ${value !== undefined ? value : baseBar}%
        );
        `}
        id="meter"
        class={`
        progress
        size-[${size}px]
        absolute
        z-0
        rounded-full
        `}/>
    <div
        bind:this={progressInner}
        class={`
        bg-blue-500
        absolute
        size-[${size-10}px]
        rounded-full
        z-3
        text-white
        flex
        justify-center
        items-center
        `}>
        <slot />
    </div>
</div>

<style>
    .progress{
        background: conic-gradient(
        rgb(242, 242, 242) 80%,
          rgb(3, 133, 255) 80%
        );
    }
</style>
