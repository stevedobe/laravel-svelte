<script lang="ts">
    import SectionTitle from './SectionTitle.svelte';

    export let classes = '';
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
        <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 dark:bg-gray-800">
            <slot name="content" />
        </div>
    </div>
</div>
