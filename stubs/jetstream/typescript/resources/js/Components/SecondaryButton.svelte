<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let type: 'submit' | 'button' = 'button';
    export let disabled = false;
    export let classes = '';
    export let dataCy = '';

    const dispatch = createEventDispatcher();

    const baseClasses =
        'inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300';
</script>

{#if disabled}
    <button {type} disabled class="{baseClasses} opacity-50 {classes}" data-cy={dataCy}>
        <slot />
    </button>
{:else}
    <button
        {type}
        class="{baseClasses} transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800 {classes}"
        on:click={() => dispatch('clicked')}
        data-cy={dataCy}
    >
        <slot />
    </button>
{/if}
