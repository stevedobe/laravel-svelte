<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let type: 'submit' | 'button' = 'submit';
    export let disabled = false;
    export let classes = '';
    export let dataTestId = '';

    const dispatch = createEventDispatcher();

    const baseClasses =
        'inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white dark:bg-gray-200 dark:text-gray-800';
</script>

{#if disabled}
    <button {type} disabled class="{baseClasses} opacity-50 {classes}" data-testid={dataTestId}>
        <slot />
    </button>
{:else}
    <button
        {type}
        class="{baseClasses} transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-gray-900 dark:hover:bg-white dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300 {classes}"
        on:click={() => dispatch('clicked')}
        data-testid={dataTestId}
    >
        <slot />
    </button>
{/if}
