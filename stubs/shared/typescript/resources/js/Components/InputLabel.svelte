<script lang="ts">
    export let forElement: string;
    export let value = '';
    export let classes = '';
</script>

<label
    for={forElement}
    class="block text-sm font-medium text-gray-700 dark:text-gray-300 {classes}"
>
    {#if value}
        <span>{value}</span>
    {:else}
        <span><slot /></span>
    {/if}
</label>
