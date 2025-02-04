<script lang="ts">
    import ApiTokenManager from '@/Pages/API/Partials/ApiTokenManager.svelte';
    import AppLayout from '@/Layouts/AppLayout.svelte';
    import type { Token } from './Token';

    export let tokens: Token[];
    export let availablePermissions: string[];
    export let defaultPermissions: string[];
</script>

<AppLayout title="API Tokens">
    <div slot="header" class="contents">
        <h2 class="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
            API Tokens
        </h2>
    </div>

    <div>
        <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
            <ApiTokenManager {tokens} {availablePermissions} {defaultPermissions} />
        </div>
    </div>
</AppLayout>
