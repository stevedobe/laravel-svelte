<script lang="ts">
    export let id: string;
    export let checked = false;
</script>

<input
    {id}
    type="checkbox"
    bind:checked
    class="rounded-sm border-gray-300 text-indigo-600 shadow-xs focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
    {...$$restProps}
/>
