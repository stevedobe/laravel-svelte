<script lang="ts">
    import { inertia } from '@inertiajs/svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        href?: string;
        active?: boolean;
        as?: 'a' | 'button' | undefined;
        children?: Snippet;
    }

    let { href = '', active = false, as = undefined, children }: Props = $props();

    let classes = $derived(
        active
            ? 'block w-full ps-3 pe-4 py-2 border-l-4 border-indigo-400 dark:border-indigo-600 text-start text-base font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 focus:outline-hidden focus:text-indigo-800 dark:focus:text-indigo-200 focus:bg-indigo-100 dark:focus:bg-indigo-900 focus:border-indigo-700 dark:focus:border-indigo-300 transition duration-150 ease-in-out'
            : 'block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-hidden focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600 transition duration-150 ease-in-out',
    );
</script>

<div>
    {#if as === 'button'}
        <button type="submit" class={classes}>
            {@render children?.()}
        </button>
    {:else if as === 'a'}
        <a {href} class={classes}>
            {@render children?.()}
        </a>
    {:else}
        <a {href} use:inertia class={classes}>
            {@render children?.()}
        </a>
    {/if}
</div>
