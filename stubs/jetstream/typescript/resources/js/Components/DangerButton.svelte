<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let type: 'submit' | 'button' = 'button';
    export let disabled = false;
    export let classes = '';
    export let dataTestId = '';

    const dispatch = createEventDispatcher();

    const baseClasses =
        'inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white';
</script>

{#if disabled}
    <button {type} disabled class="{baseClasses} opacity-50 {classes}" data-testid={dataTestId}>
        <slot />
    </button>
{:else}
    <button
        {type}
        class="{baseClasses} transition duration-150 ease-in-out hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:bg-red-700 dark:focus:ring-offset-gray-800 {classes}"
        on:click={() => dispatch('clicked')}
        data-testid={dataTestId}
    >
        <slot />
    </button>
{/if}
