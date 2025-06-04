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
        type = 'submit',
        disabled = false,
        classes = '',
        dataTestId = '',
        children,
        clicked = () => {
            // Do nothing by default
        },
    }: Props = $props();

    const baseClasses =
        'inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white dark:bg-gray-200 dark:text-gray-800';
</script>

{#if disabled}
    <button {type} disabled class="{baseClasses} opacity-50 {classes}" data-testid={dataTestId}>
        {@render children?.()}
    </button>
{:else}
    <button
        {type}
        class="{baseClasses} transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-gray-900 dark:hover:bg-white dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300 {classes}"
        onclick={() => clicked?.()}
        data-testid={dataTestId}
    >
        {@render children?.()}
    </button>
{/if}
