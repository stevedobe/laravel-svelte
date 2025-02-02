<script lang="ts">
    import { fade } from 'svelte/transition';

    export let align: 'left' | 'right' = 'right';
    export let width: 48 | 60 = 48;
    export let contentClasses = 'py-1 bg-white dark:bg-gray-700';

    const widthClass = {
        48: 'w-48',
        60: 'w-60',
    }[width];

    let open = false;
</script>

<div class="relative">
    <div
        on:click={() => (open = !open)}
        on:keydown={() => (open = !open)}
        role="button"
        tabindex="0"
    >
        <slot name="trigger" />
    </div>

    <!-- Full Screen Dropdown Overlay -->
    <div
        class="fixed inset-0 z-40"
        class:hidden={!open}
        on:click={() => (open = false)}
        on:keydown={() => (open = false)}
        role="button"
        tabindex="0"
    />

    {#if open}
        <div in:fade={{ duration: 75 }} out:fade={{ duration: 200 }}>
            <div
                class="absolute z-50 mt-2 rounded-md shadow-lg {widthClass} {align === 'left'
                    ? 'start-0 ltr:origin-top-left rtl:origin-top-right'
                    : 'end-0 ltr:origin-top-right rtl:origin-top-left'}"
                on:click={() => (open = false)}
                on:keydown={() => (open = false)}
                role="button"
                tabindex="0"
            >
                <div class="rounded-md ring-1 ring-black/5 {contentClasses}">
                    <slot name="content" />
                </div>
            </div>
        </div>
    {/if}
</div>
