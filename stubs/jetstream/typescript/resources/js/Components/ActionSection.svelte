<script lang="ts">
    import SectionTitle from './SectionTitle.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        classes?: string;
        actionSectionTitle?: Snippet;
        actionSectionDescription?: Snippet;
        actionSectionContent?: Snippet;
    }

    let {
        classes = '',
        actionSectionTitle,
        actionSectionDescription,
        actionSectionContent,
    }: Props = $props();
</script>

<div class="md:grid md:grid-cols-3 md:gap-6 {classes}">
    <SectionTitle>
        {#snippet sectionTitleTitle()}
            <div class="contents">
                {@render actionSectionTitle?.()}
            </div>
        {/snippet}

        {#snippet sectionTitleDescription()}
            <div class="contents">
                {@render actionSectionDescription?.()}
            </div>
        {/snippet}
    </SectionTitle>

    <div class="mt-5 md:col-span-2 md:mt-0">
        <div class="bg-white px-4 py-5 shadow-sm sm:rounded-lg sm:p-6 dark:bg-gray-800">
            {@render actionSectionContent?.()}
        </div>
    </div>
</div>
