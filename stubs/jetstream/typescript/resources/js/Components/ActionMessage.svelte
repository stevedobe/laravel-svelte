<script lang="ts">
    import { fade } from 'svelte/transition';

    export let on: boolean;
    export let classes = '';
</script>

<div class={classes}>
    <div in:fade out:fade={{ delay: 1000, duration: 1000 }}>
        <div class="text-sm text-gray-600 dark:text-gray-400" class:hidden={!on}>
            <slot />
        </div>
    </div>
</div>
