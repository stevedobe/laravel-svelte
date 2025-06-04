<script lang="ts">
    import Helmet from '@/Components/Helmet.svelte';
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.svelte';
    import DeleteUserForm from './Partials/DeleteUserForm.svelte';
    import UpdatePasswordForm from './Partials/UpdatePasswordForm.svelte';
    import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.svelte';

    interface Props {
        mustVerifyEmail: boolean;
        status: string;
    }

    let { mustVerifyEmail, status }: Props = $props();
</script>

<Helmet title="Profile" />

<AuthenticatedLayout>
    {#snippet authenticatedLayoutHeader()}
        <div class="contents">
            <h2 class="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
                Profile
            </h2>
        </div>
    {/snippet}

    <div class="py-12">
        <div class="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
            <div class="bg-white p-4 shadow-sm sm:rounded-lg sm:p-8 dark:bg-gray-800">
                <UpdateProfileInformationForm {mustVerifyEmail} {status} classes="max-w-xl" />
            </div>

            <div class="bg-white p-4 shadow-sm sm:rounded-lg sm:p-8 dark:bg-gray-800">
                <UpdatePasswordForm classes="max-w-xl" />
            </div>

            <div class="bg-white p-4 shadow-sm sm:rounded-lg sm:p-8 dark:bg-gray-800">
                <DeleteUserForm classes="max-w-xl" />
            </div>
        </div>
    </div>
</AuthenticatedLayout>
