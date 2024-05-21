<script lang="ts">
  import { onMount } from 'svelte';

  let popoverContainer: HTMLElement;
  let canvas: HTMLCanvasElement;
  let canvasContainer: HTMLElement;
  let ctx: CanvasRenderingContext2D;
  let isDragging = false;
  let elements = [];
  let elContainer: HTMLElement;

  let startX: number, startY: number, endX: number, endY: number;

  let gridSpace = 15;
  onMount(() => {
      ctx = canvas.getContext('2d');

      popoverContainer = document.getElementById('createPopover');

      popoverContainer.addEventListener('toggle', () => {
          canvas.width = canvasContainer.offsetWidth;
          canvas.height = canvasContainer.offsetHeight;

          drawGrid();
      });
  });

  function snapToGrid(value: number, gridSize: number): number {
      return Math.round(value / gridSize) * gridSize;
  }

  function onMouseDown(event: MouseEvent) {
      isDragging = true;
      startX = snapToGrid(event.offsetX, gridSpace);
      startY = snapToGrid(event.offsetY, gridSpace);
      clearCanvas();
      drawGrid();
  }

  function onMouseMove(event: MouseEvent) {
      if (!isDragging) return;

      clearCanvas();
      drawGrid();
      const currentX = snapToGrid(event.offsetX, gridSpace);
      const currentY = snapToGrid(event.offsetY, gridSpace);
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
      ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
  }

  function onMouseUp(event: MouseEvent) {
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
    popover
    id="createPopover"
    class="relative w-[100%] h-[100%] rounded-md border-slate-300 shadow-md"
>
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
      on:pointerdown={onMouseDown}
      on:pointermove={onMouseMove}
      on:pointerup={onMouseUp}
  >
      <canvas bind:this={canvas} />
  </div>

  <div class="left-0 absolute w-full bottom-3 flex justify-center">
      <button class="btn border-2 variant-filled p-2 rounded-md bg-slate-300">Save</button>
  </div>
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
