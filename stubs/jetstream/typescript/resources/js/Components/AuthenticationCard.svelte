<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        authenticationCardLogo?: Snippet;
        children?: Snippet;
    }

    let { authenticationCardLogo, children }: Props = $props();
</script>

<div
    class="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900"
>
    <div>
        {@render authenticationCardLogo?.()}
    </div>

    <div
        class="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800"
    >
        {@render children?.()}
    </div>
</div>
