<script lang="ts">
    import { inertia } from '@inertiajs/svelte';

    export let href = '';
    export let as: 'a' | 'button' = 'a';
</script>

<div>
    {#if as === 'button'}
        <button
            type="submit"
            class="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
        >
            <slot />
        </button>
    {:else}
        <a
            {href}
            use:inertia
            class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
        >
            <slot />
        </a>
    {/if}
</div>
