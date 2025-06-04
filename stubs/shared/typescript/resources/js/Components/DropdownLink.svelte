<script lang="ts">
    import { inertia } from '@inertiajs/svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        href?: string;
        as?: 'a' | 'button' | undefined;
        children?: Snippet;
    }

    let { href = '', as = undefined, children }: Props = $props();
</script>

<div>
    {#if as === 'button'}
        <button
            type="submit"
            class="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
        >
            {@render children?.()}
        </button>
    {:else if as === 'a'}
        <a
            {href}
            class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
        >
            {@render children?.()}
        </a>
    {:else}
        <a
            {href}
            use:inertia
            class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
        >
            {@render children?.()}
        </a>
    {/if}
</div>
