<script lang="ts">
    import Helmet from '@/Components/Helmet.svelte';
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.svelte';
</script>

<Helmet title="Dashboard" />

<AuthenticatedLayout>
    {#snippet authenticatedLayoutHeader()}
        <div class="contents">
            <h2 class="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
                Dashboard
            </h2>
        </div>
    {/snippet}

    <div class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="overflow-hidden bg-white shadow-xs sm:rounded-lg dark:bg-gray-800">
                <div class="p-6 text-gray-900 dark:text-gray-100">You're logged in!</div>
            </div>
        </div>
    </div>
</AuthenticatedLayout>
