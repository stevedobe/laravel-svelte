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
        'inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white';
</script>

{#if disabled}
    <button {type} disabled class="{baseClasses} opacity-50 {classes}" data-testid={dataTestId}>
        {@render children?.()}
    </button>
{:else}
    <button
        {type}
        class="{baseClasses} transition duration-150 ease-in-out hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:bg-red-700 dark:focus:ring-offset-gray-800 {classes}"
        onclick={() => clicked?.()}
        data-testid={dataTestId}
    >
        {@render children?.()}
    </button>
{/if}
