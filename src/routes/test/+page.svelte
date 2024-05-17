<script>
  let prompt = '';
  let code = '';
  let response = '';
  let fileInput = null;

  function handleSubmit() {
    // Handle the form submission
  }
</script>

<div class="h-screen flex">
  <div class="w-1/3 p-4 border border-black">
    <input
      class="w-full p-2 mb-4 border border-black"
      type="text"
      placeholder="prompt text input"
      bind:value={prompt}
    />

    <div class="flex items-center mb-4">
      <input
        class="mr-2 w-full p-1 border border-black"
        type="file"
        bind:this={fileInput}
      />
      <input
        class="p-2 border border-black"
        type="text"
        placeholder="file input"
      />
    </div>

    <textarea
      class="w-full p-2 mb-4 border border-black"
      placeholder="code sample textarea"
      bind:value={code}
    ></textarea>

    <button
      class="w-full p-2 bg-blue-200 border border-black"
      on:click={handleSubmit}
    >
      submit button
    </button>
  </div>

  <div class="flex-1 p-4 border border-black">
    <textarea
      class="w-full h-full p-2 border border-black"
      placeholder="response textarea"
      bind:value={response}
    ></textarea>
  </div>
</div>
