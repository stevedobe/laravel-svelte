<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        sectionTitleTitle?: Snippet;
        sectionTitleDescription?: Snippet;
        sectionTitleAside?: Snippet;
    }

    let { sectionTitleTitle, sectionTitleDescription, sectionTitleAside }: Props = $props();
</script>

<div class="flex justify-between md:col-span-1">
    <div class="px-4 sm:px-0">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {@render sectionTitleTitle?.()}
        </h3>

        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {@render sectionTitleDescription?.()}
        </p>
    </div>

    <div class="px-4 sm:px-0">
        {@render sectionTitleAside?.()}
    </div>
</div>
