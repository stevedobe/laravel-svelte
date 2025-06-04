<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        type?: 'button' | 'submit' | 'reset';
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
</script>

<button
    {type}
    {disabled}
    onclick={() => clicked?.()}
    class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:bg-red-700 dark:focus:ring-offset-gray-800 {classes}"
    class:opacity-25={disabled}
    data-testid={dataTestId}
>
    {@render children?.()}
</button>
