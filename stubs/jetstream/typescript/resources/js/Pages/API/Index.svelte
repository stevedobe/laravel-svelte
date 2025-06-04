<script lang="ts">
    import ApiTokenManager from '@/Pages/API/Partials/ApiTokenManager.svelte';
    import AppLayout from '@/Layouts/AppLayout.svelte';
    import type { Token } from './Token';

    interface Props {
        tokens: Token[];
        availablePermissions: string[];
        defaultPermissions: string[];
    }

    let { tokens, availablePermissions, defaultPermissions }: Props = $props();
</script>

<AppLayout title="API Tokens">
    {#snippet appLayoutheader()}
        <div class="contents">
            <h2 class="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
                API Tokens
            </h2>
        </div>
    {/snippet}

    <div>
        <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
            <ApiTokenManager {tokens} {availablePermissions} {defaultPermissions} />
        </div>
    </div>
</AppLayout>
