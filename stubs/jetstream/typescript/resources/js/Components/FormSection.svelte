<script lang="ts">
    import SectionTitle from './SectionTitle.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        classes?: string;
        formSectionTitle?: Snippet;
        formSectionDescription?: Snippet;
        formSectionForm?: Snippet;
        formSectionActions?: Snippet;
        submitted?: () => void;
    }

    let {
        classes = '',
        formSectionTitle,
        formSectionDescription,
        formSectionForm,
        formSectionActions,
        submitted = () => {
            // Do nothing by default
        },
    }: Props = $props();

    let hasActions = $derived(!!formSectionActions);

    const submit = (event: Event) => {
        event.preventDefault();

        submitted?.();
    };
</script>

<div class="md:grid md:grid-cols-3 md:gap-6 {classes}">
    <SectionTitle>
        {#snippet sectionTitleTitle()}
            <div class="contents">
                {@render formSectionTitle?.()}
            </div>
        {/snippet}

        {#snippet sectionTitleDescription()}
            <div class="contents">
                {@render formSectionDescription?.()}
            </div>
        {/snippet}
    </SectionTitle>

    <div class="mt-5 md:col-span-2 md:mt-0">
        <form onsubmit={submit}>
            <div
                class="bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800"
                class:sm:rounded-tl-md={hasActions}
                class:sm:rounded-tr-md={hasActions}
                class:sm:rounded-md={!hasActions}
            >
                <div class="grid grid-cols-6 gap-6">
                    {@render formSectionForm?.()}
                </div>
            </div>

            {#if hasActions}
                <div
                    class="flex items-center justify-end bg-gray-50 px-4 py-3 text-end shadow-sm sm:rounded-br-md sm:rounded-bl-md sm:px-6 dark:bg-gray-800"
                >
                    {@render formSectionActions?.()}
                </div>
            {/if}
        </form>
    </div>
</div>
