<script lang="ts">
    import { fade } from 'svelte/transition';
    import type { Snippet } from 'svelte';

    interface Props {
        on: boolean;
        classes?: string;
        children?: Snippet;
    }

    let { on, classes = '', children }: Props = $props();
</script>

<div class={classes}>
    <div in:fade out:fade={{ delay: 1000, duration: 1000 }}>
        <div class="text-sm text-gray-600 dark:text-gray-400" class:hidden={!on}>
            {@render children?.()}
        </div>
    </div>
</div>
