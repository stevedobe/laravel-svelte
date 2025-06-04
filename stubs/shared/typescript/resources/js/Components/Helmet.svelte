<script lang="ts">
    import { page } from '@inertiajs/svelte';

    interface Props {
        title?: string;
        description?: string;
    }

    let { title = '', description = '' }: Props = $props();
</script>

<svelte:head>
    <title>{title ? `${title} | ` : ''}{$page.props.webtend.appName}</title>

    {#if description}
        <meta name="description" content={description} />
    {/if}
</svelte:head>
