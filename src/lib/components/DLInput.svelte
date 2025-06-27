<script>
  let inputText = $state('');
  let dataList = $state([]);

  let { input } = $props();
  let highlightedIndex = $state(-1);

  function filterList() {
    if (inputText === '') {
      dataList = [];
    } else {
      dataList = input.filter(item =>
        item.toLowerCase().includes(inputText.toLowerCase())
      );
    }
  }

</script>

<!-- Input field -->
<div class="flex relative">

<input
  class="w-full rounded-md border-2 border-gray-300 p-2"
  list="browsers"
  autocomplete="off"
  name="browser"
  id="browser"
  >

<datalist id="browsers" class="w-full">
  {#each input as item}
    <option value={item} />
  {/each}
</datalist>

<!--

<input
  class="w-full rounded-md border-2 border-gray-300 p-2"
  type="text"
  bind:value={inputText}
  on:keydown={handleKeydown}
  placeholder="Type to search..."
  on:input={filterList} />
-->

<!-- Data list -->
<!--

{#if open}
  <div class="autocomplete-items top-10 mt-2 rounded-md absolute w-full bg-white z-10">
    {#each dataList as item}
      <div on:click={() => inputText = item}>{item}</div>
    {/each}
  </div>
{/if}
-->
</div>
