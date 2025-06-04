<script lang="ts">
    import { fade } from 'svelte/transition';
    import type { Snippet } from 'svelte';

    interface Props {
        align?: 'left' | 'right';
        width?: 48 | 60;
        contentClasses?: string;
        dropdownTrigger?: Snippet;
        dropdownContent?: Snippet;
    }

    let {
        align = 'right',
        width = 48,
        contentClasses = 'py-1 bg-white dark:bg-gray-700',
        dropdownTrigger,
        dropdownContent,
    }: Props = $props();

    const widthClass = {
        48: 'w-48',
        60: 'w-60',
    }[width];

    let open = $state(false);
</script>

<div class="relative">
    <div onclick={() => (open = !open)} onkeydown={() => (open = !open)} role="button" tabindex="0">
        {@render dropdownTrigger?.()}
    </div>

    <!-- Full Screen Dropdown Overlay -->
    <div
        class="fixed inset-0 z-40"
        class:hidden={!open}
        onclick={() => (open = false)}
        onkeydown={() => (open = false)}
        role="button"
        tabindex="0"
    ></div>

    {#if open}
        <div in:fade={{ duration: 75 }} out:fade={{ duration: 200 }}>
            <div
                class="absolute z-50 mt-2 rounded-md shadow-lg {widthClass} {align === 'left'
                    ? 'start-0 ltr:origin-top-left rtl:origin-top-right'
                    : 'end-0 ltr:origin-top-right rtl:origin-top-left'}"
                onclick={() => (open = false)}
                onkeydown={() => (open = false)}
                role="button"
                tabindex="0"
            >
                <div class="rounded-md ring-1 ring-black/5 {contentClasses}">
                    {@render dropdownContent?.()}
                </div>
            </div>
        </div>
    {/if}
</div>
