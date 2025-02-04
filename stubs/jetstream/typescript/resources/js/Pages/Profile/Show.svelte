<script lang="ts">
    import { page } from '@inertiajs/svelte';
    import AppLayout from '@/Layouts/AppLayout.svelte';
    import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm.svelte';
    import LogoutOtherBrowserSessionsForm from '@/Pages/Profile/Partials/LogoutOtherBrowserSessionsForm.svelte';
    import SectionBorder from '@/Components/SectionBorder.svelte';
    import TwoFactorAuthenticationForm from '@/Pages/Profile/Partials/TwoFactorAuthenticationForm.svelte';
    import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm.svelte';
    import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm.svelte';
    import type { Session } from './Session';

    export let confirmsTwoFactorAuthentication: boolean;
    export let sessions: Session[];
</script>

<AppLayout title="Profile">
    <div slot="header" class="contents">
        <h2 class="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
            Profile
        </h2>
    </div>

    <div>
        <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
            {#if $page.props.jetstream.canUpdateProfileInformation}
                <div>
                    <UpdateProfileInformationForm user={$page.props.auth.user} />

                    <SectionBorder />
                </div>
            {/if}

            {#if $page.props.jetstream.canUpdatePassword}
                <div>
                    <UpdatePasswordForm classes="mt-10 sm:mt-0" />

                    <SectionBorder />
                </div>
            {/if}

            {#if $page.props.jetstream.canManageTwoFactorAuthentication}
                <div>
                    <TwoFactorAuthenticationForm
                        requiresConfirmation={confirmsTwoFactorAuthentication}
                        classes="mt-10 sm:mt-0"
                    />

                    <SectionBorder />
                </div>
            {/if}

            <LogoutOtherBrowserSessionsForm {sessions} classes="mt-10 sm:mt-0" />

            {#if $page.props.jetstream.hasAccountDeletionFeatures}
                <div class="contents">
                    <SectionBorder />

                    <DeleteUserForm classes="mt-10 sm:mt-0" />
                </div>
            {/if}
        </div>
    </div>
</AppLayout>
