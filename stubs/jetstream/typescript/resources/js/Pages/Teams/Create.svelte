<script lang="ts">
    import AppLayout from '@/Layouts/AppLayout.svelte';
    import CreateTeamForm from '@/Pages/Teams/Partials/CreateTeamForm.svelte';
</script>

<AppLayout title="Create Team">
    <div slot="header" class="contents">
        <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Create Team
        </h2>
    </div>

    <div>
        <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
            <CreateTeamForm />
        </div>
    </div>
</AppLayout>
