<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import SectionTitle from './SectionTitle.svelte';

    export let classes = '';

    const dispatch = createEventDispatcher();

    $: hasActions = !!$$slots.actions;
</script>

<div class="md:grid md:grid-cols-3 md:gap-6 {classes}">
    <SectionTitle>
        <div slot="title" class="contents">
            <slot name="title" />
        </div>

        <div slot="description" class="contents">
            <slot name="description" />
        </div>
    </SectionTitle>

    <div class="mt-5 md:col-span-2 md:mt-0">
        <form on:submit|preventDefault={() => dispatch('submitted')}>
            <div
                class="bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800"
                class:sm:rounded-tl-md={hasActions}
                class:sm:rounded-tr-md={hasActions}
                class:sm:rounded-md={!hasActions}
            >
                <div class="grid grid-cols-6 gap-6">
                    <slot name="form" />
                </div>
            </div>

            {#if hasActions}
                <div
                    class="flex items-center justify-end bg-gray-50 px-4 py-3 text-end shadow-sm sm:rounded-br-md sm:rounded-bl-md sm:px-6 dark:bg-gray-800"
                >
                    <slot name="actions" />
                </div>
            {/if}
        </form>
    </div>
</div>
