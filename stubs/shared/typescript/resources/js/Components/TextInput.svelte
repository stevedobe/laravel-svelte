<script lang="ts">
    import { onMount } from 'svelte';

    interface Props {
        id?: string;
        name?: string;
        type?: string;
        value: string | number | null;
        autocomplete?: HTMLInputElement['autocomplete'];
        autofocus?: boolean;
        disabled?: boolean;
        required?: boolean;
        error?: string;
        classes?: string;
        dataTestId?: string;
        placeholder?: string;
        inputmode?:
            | 'email'
            | 'tel'
            | 'text'
            | 'search'
            | 'url'
            | 'none'
            | 'numeric'
            | 'decimal'
            | null
            | undefined;
        entered?: () => void;
    }

    let {
        id = '',
        name = '',
        type = 'text',
        value = $bindable(),
        autocomplete = 'off',
        autofocus = false,
        disabled = false,
        required = false,
        error = '',
        classes = '',
        dataTestId = '',
        placeholder = '',
        inputmode = undefined,
        entered = () => {
            // Do nothing by default
        },
    }: Props = $props();

    let input: HTMLInputElement | undefined = $state();

    const handleInput = (event: Event): void => {
        value = (event.target as HTMLInputElement).value;
    };

    const onKeyUp = (event: KeyboardEvent): void => {
        if (event.key === 'Enter') {
            entered?.();
        }
    };

    export function focus() {
        input?.focus();
    }

    onMount(() => {
        if (autofocus) {
            focus();
        }
    });
</script>

<input
    {id}
    {name}
    {type}
    bind:this={input}
    {value}
    {autocomplete}
    {disabled}
    {required}
    {placeholder}
    {inputmode}
    class="rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 {classes}"
    class:border-red-600={error}
    oninput={handleInput}
    onkeyup={onKeyUp}
    data-testid={dataTestId}
/>
