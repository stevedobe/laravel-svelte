<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        forElement: string;
        value?: string;
        classes?: string;
        children?: Snippet;
    }

    let { forElement, value = '', classes = '', children }: Props = $props();
</script>

<label
    for={forElement}
    class="block text-sm font-medium text-gray-700 dark:text-gray-300 {classes}"
>
    {#if value}
        <span>{value}</span>
    {:else}
        <span>{@render children?.()}</span>
    {/if}
</label>
