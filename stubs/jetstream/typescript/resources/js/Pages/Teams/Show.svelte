<script lang="ts">
    import AppLayout from '@/Layouts/AppLayout.svelte';
    import DeleteTeamForm from '@/Pages/Teams/Partials/DeleteTeamForm.svelte';
    import SectionBorder from '@/Components/SectionBorder.svelte';
    import TeamMemberManager from '@/Pages/Teams/Partials/TeamMemberManager.svelte';
    import UpdateTeamNameForm from '@/Pages/Teams/Partials/UpdateTeamNameForm.svelte';
    import type { Permissions, Role, Team } from '@/Types';

    export let team: Team;
    export let availableRoles: Role[];
    export let permissions: Permissions;
</script>

<AppLayout title="Team Settings">
    <div slot="header" class="contents">
        <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Team Settings
        </h2>
    </div>

    <div>
        <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
            <UpdateTeamNameForm {team} {permissions} />

            <TeamMemberManager {team} {availableRoles} {permissions} classes="mt-10 sm:mt-0" />

            {#if permissions.canDeleteTeam && !team.personal_team}
                <SectionBorder />

                <DeleteTeamForm {team} classes="mt-10 sm:mt-0" />
            {/if}
        </div>
    </div>
</AppLayout>
