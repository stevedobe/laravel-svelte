<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    export let show = false;
    export let maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = '2xl';
    export let closeable = true;

    const dispatch = createEventDispatcher();

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    $: document.body.style.overflow = show ? 'hidden' : 'visible';

    const close = () => {
        if (closeable) {
            dispatch('closed');
        }
    };

    const closeOnEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();

            if (show) {
                close();
            }
        }
    };

    onMount(() => {
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('keydown', closeOnEscape);
            document.body.style.overflow = 'visible';
        };
    });
</script>

{#if show}
    <div
        class="z-50 m-0 min-h-full min-w-full overflow-y-auto bg-transparent backdrop:bg-transparent"
        role="dialog"
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 200 }}
    >
        <div class="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-0">
            <div
                class="fixed inset-0 transform transition-all"
                on:click={close}
                on:keydown={close}
                role="button"
                tabindex="0"
            >
                <div class="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900"></div>
            </div>

            <div
                class="mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full dark:bg-gray-800 {maxWidthClass}"
            >
                <slot />
            </div>
        </div>
    </div>
{/if}
