<script lang="ts">
    interface Props {
        id: string;
        checked?: boolean;
        required?: boolean;
    }

    let { id, checked = $bindable(false), required = false }: Props = $props();
</script>

<input
    {id}
    type="checkbox"
    bind:checked
    {required}
    class="rounded-sm border-gray-300 text-indigo-600 shadow-xs focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
/>
