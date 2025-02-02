<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';

    export let value: string | number | null;
    export let error = '';
    export let classes = '';
    export let autofocus = false;

    const dispatch = createEventDispatcher();

    let input: HTMLInputElement;

    const handleInput = (e: Event): void => {
        value = (e.target as HTMLInputElement).value;
    };

    const onKeyUp = (e: KeyboardEvent): void => {
        if (e.key === 'Enter') {
            dispatch('entered');
        }
    };

    export function focus() {
        input.focus();
    }

    onMount(() => {
        if (autofocus) {
            focus();
        }
    });
</script>

<input
    bind:this={input}
    {value}
    class="rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 {classes}"
    class:border-red-600={error}
    on:input={handleInput}
    on:keyup={onKeyUp}
    {...$$restProps}
/>
