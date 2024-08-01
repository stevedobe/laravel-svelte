<script lang="ts">
    import AppLayout from '@/Layouts/AppLayout.svelte';
    import Welcome from '@/Components/Welcome.svelte';
</script>

<AppLayout title="Dashboard">
    <div slot="header" class="contents">
        <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Dashboard
        </h2>
    </div>

    <div class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="overflow-hidden bg-white shadow-xl sm:rounded-lg dark:bg-gray-800">
                <Welcome />
            </div>
        </div>
    </div>
</AppLayout>
