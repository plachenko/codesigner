<script lang="ts">
  let { value, testingParent } = $props();

  function test() {
    console.log('child', value)
    value = 'goodbye world';
    testingParent(value);
  }
</script>

<button onclick={test}>click</button>
