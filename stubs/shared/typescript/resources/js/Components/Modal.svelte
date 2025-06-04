<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, scale } from 'svelte/transition';
    import type { Snippet } from 'svelte';

    interface Props {
        show?: boolean;
        maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
        closeable?: boolean;
        children?: Snippet;
        closed?: () => void;
    }

    let {
        show = false,
        maxWidth = '2xl',
        closeable = true,
        children,
        closed = () => {
            // Do nothing by default
        },
    }: Props = $props();

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    $effect(() => {
        document.body.style.overflow = show ? 'hidden' : 'visible';
    });

    const close = () => {
        if (closeable) {
            closed?.();
        }
    };

    const onBackdropActivation = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            close();
        }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            event.preventDefault();

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
    >
        <div class="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-0">
            <div
                class="fixed inset-0"
                onclick={close}
                onkeydown={onBackdropActivation}
                aria-label="Close modal"
                role="button"
                tabindex="0"
                in:fade={{ duration: 150 }}
                out:fade={{ duration: 100 }}
            >
                <div class="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900"></div>
            </div>

            <div
                class="relative z-10 mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full dark:bg-gray-800 {maxWidthClass}"
                in:scale={{ duration: 200, start: 0.95, delay: 50, opacity: 1 }}
                out:scale={{ duration: 150, start: 0.95 }}
            >
                {@render children?.()}
            </div>
        </div>
    </div>
{/if}
