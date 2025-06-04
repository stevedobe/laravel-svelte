<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        disabled?: boolean;
        classes?: string;
        dataTestId?: string;
        children?: Snippet;
    }

    let { disabled = false, classes = '', dataTestId = '', children }: Props = $props();
</script>

<button
    type="submit"
    {disabled}
    class="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-gray-900 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300 {classes}"
    class:opacity-25={disabled}
    data-testid={dataTestId}
>
    {@render children?.()}
</button>
