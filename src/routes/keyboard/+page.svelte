<script>

</script>


<div class="flex flex-1 justify-center items-center h-full">

    {#each Array(2) as dot}
        <div class="w-full relative flex justify-center">
            <div class="absolute rounded-full bg-red-400 size-10"></div>
            <div class="absolute rounded-full bg-red-400 size-10"></div>
        </div>
    {/each}

</div>

<style>

</style>
