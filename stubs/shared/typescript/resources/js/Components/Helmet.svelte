<script lang="ts">
    import { page } from '@inertiajs/svelte';

    export let title = '';
    export let description = '';
</script>

<svelte:head>
    <title>{title ? `${title} | ` : ''}{$page.props.appName}</title>

    {#if description}
        <meta name="description" content={description} />
    {/if}
</svelte:head>
