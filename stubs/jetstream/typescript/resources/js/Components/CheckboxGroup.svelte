<script lang="ts">
    interface Props {
        checkboxes: string[];
        group?: string[];
    }

    let { checkboxes, group = $bindable([]) }: Props = $props();
</script>

{#each checkboxes as checkbox}
    <label for={checkbox} class="flex items-center">
        <input
            id={checkbox}
            type="checkbox"
            bind:group
            value={checkbox}
            class="rounded-sm border-gray-300 text-indigo-600 shadow-xs focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
        />
        <span class="ms-2 text-sm text-gray-600 dark:text-gray-400">{checkbox}</span>
    </label>
{/each}
