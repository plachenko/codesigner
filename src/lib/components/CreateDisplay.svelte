<script lang="ts">
  import { onMount } from 'svelte';

  let popoverContainer: HTMLElement;
  let canvas: HTMLCanvasElement;
  let canvasContainer: HTMLElement;
  let ctx: CanvasRenderingContext2D;
  let isDragging = false;
  let elements = $state([]);
  let elContainer: HTMLElement;
  let createPopover: HTMLElement;

  let startX: number, startY: number, endX: number, endY: number;

  let {
    popoverOpenEvt
  }: {
    popoverOpenEvt: () => void
  } = $props();

  let gridSpace = 15;
  onMount(() => {
    ctx = canvas.getContext('2d');
    // createPopover.togglePopover('open');

      popoverContainer = document.getElementById('createPopover');

      createPopover.addEventListener('toggle', (e) => {
          canvas.width = canvasContainer.offsetWidth;
          canvas.height = canvasContainer.offsetHeight;

          drawGrid();
      });

      /*
        createPopover.addEventListener('beforetoggle', (e: ToggleEvent): void => {
            popoverOpenEvt(e.newState == 'open');
        });
        */
  });

  function snapToGrid(value: number, gridSize: number): number {
      return Math.round(value / gridSize) * gridSize;
  }

  function onPointerDn(event: PointerEvent) {
      event.preventDefault();

      isDragging = true;

      startX = snapToGrid(event.offsetX, gridSpace);
      startY = snapToGrid(event.offsetY, gridSpace);
      clearCanvas();
      drawGrid();
  }

  function onPointerMv(event: PointerEvent) {

    if (!isDragging) return;

    clearCanvas();
    drawGrid();
    const currentX = snapToGrid(event.offsetX, gridSpace);
    const currentY = snapToGrid(event.offsetY, gridSpace);
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
  }

  function onPointerUp(event: PointerEvent) {
      if (!isDragging) return;
      isDragging = false;

      endX = snapToGrid(event.offsetX, gridSpace);
      endY = snapToGrid(event.offsetY, gridSpace);

      const width = endX - startX;
      const height = endY - startY;

      if (width != 0 && height != 0) {
          elements = [...elements, {
              x: Math.min(startX, endX)+4,
              y: Math.min(startY, endY)+4,
              width: Math.abs(width),
              height: Math.abs(height),
              color: 'rgba(0, 0, 255, 0.5)'
          }];
      }

      clearCanvas();
      drawGrid();

  }

  function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawGrid() {
      for (let i = 0; i < canvas.width; i += gridSpace) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.lineWidth = 0.1;
          ctx.stroke();
      }

      for (let j = 0; j < canvas.height; j += gridSpace) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(canvas.width, j);
          ctx.stroke();
      }
  }
</script>

<div
    bind:this={createPopover}
    popover="auto"
    id="createPopover"
    class="
    relative
    w-[92%]
    h-[92%]
    touch-none
    rounded-md
    border-slate-300
    shadow-md
    relative
    ">
    <div
        onpointerdown={onPointerDn}
        onpointermove={onPointerMv}
        onpointerup={onPointerUp}
        class="
        cursor-crosshair
        absolute
        top-0
        left-0
        z-20
        w-full
        h-full
        "></div>
    <div
        bind:this={canvasContainer}
        class="
        z-0
        w-full
        h-full
        ">
        <canvas bind:this={canvas}></canvas>
    </div>
    <div
        bind:this={elContainer}
        class="
        absolute
        top-0
        left-0
        z-10
        absolute
        w-full
        h-full
        "
        >
        {#each elements as el}
        <div style={`
            position: absolute;
            left: ${el.x}px;
            top: ${el.y}px;
            background-color: ${el.color};
            width: ${el.width}px;
            height: ${el.height}px;
            border: 2px solid black;
            `}>
        </div>
        {/each}
    </div>

<!--

  <div
      bind:this={elContainer}
  >
      {#each elements as el}
        <div style={`
          position: absolute;
          left: ${el.x}px;
          top: ${el.y}px;
          background-color: ${el.color};
          width: ${el.width}px;
          height: ${el.height}px;
          border: 2px solid black;
          `}>
        </div>
      {/each}
  </div>

  <div class="w-full h-full cursor-crosshair"
      bind:this={canvasContainer}
      onpointerdown={onMouseDown}
      onpointermove={onMouseMove}
      onpointerup={onMouseUp}
  >
      <canvas bind:this={canvas} />
  </div>

  <div class="left-0 absolute w-full bottom-3 flex justify-center">
      <button>Save</button>
  </div>
-->
</div>

<style>
  :global(body){
    overscroll-behavior: none;
  }
  #createPopover::backdrop {
      @starting-style {
          opacity: 0;
      }
      background-color: #000;
      opacity: 0.6;
      transition:
          opacity 0.3s,
          display 0.3s allow-discrete;
  }
  #createPopover {
      &:popover-open {
          @starting-style {
              transform: translateY(10px);
              opacity: 0;
          }

          transform: translateY(0);
          opacity: 1;
      }

      transform: translateY(10px);
      opacity: 0;

      transition:
          transform 0.3s,
          opacity 0.3s,
          display 0.3s allow-discrete;
  }
</style>
