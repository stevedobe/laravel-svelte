<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        type?: 'submit' | 'button';
        disabled?: boolean;
        classes?: string;
        dataTestId?: string;
        children?: Snippet;
        clicked?: () => void;
    }

    let {
        type = 'button',
        disabled = false,
        classes = '',
        dataTestId = '',
        children,
        clicked = () => {
            // Do nothing by default
        },
    }: Props = $props();

    const baseClasses =
        'inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-xs dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300';
</script>

{#if disabled}
    <button {type} disabled class="{baseClasses} opacity-50 {classes}" data-testid={dataTestId}>
        {@render children?.()}
    </button>
{:else}
    <button
        {type}
        class="{baseClasses} transition duration-150 ease-in-out hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800 {classes}"
        onclick={() => clicked?.()}
        data-testid={dataTestId}
    >
        {@render children?.()}
    </button>
{/if}
