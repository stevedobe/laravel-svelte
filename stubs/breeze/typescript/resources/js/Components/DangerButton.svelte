<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let disabled = false;
    export let classes = '';
    export let dataTestId = '';

    const dispatch = createEventDispatcher();
</script>

<button
    type="button"
    {disabled}
    on:click={() => dispatch('clicked')}
    class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 dark:focus:ring-offset-gray-800 {classes}"
    class:opacity-25={disabled}
    data-testid={dataTestId}
>
    <slot />
</button>
