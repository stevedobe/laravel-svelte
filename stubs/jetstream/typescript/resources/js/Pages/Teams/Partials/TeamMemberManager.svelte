<script lang="ts">
    import { page, router, useForm } from '@inertiajs/svelte';
    import ActionMessage from '@/Components/ActionMessage.svelte';
    import ActionSection from '@/Components/ActionSection.svelte';
    import ConfirmationModal from '@/Components/ConfirmationModal.svelte';
    import DangerButton from '@/Components/DangerButton.svelte';
    import DialogModal from '@/Components/DialogModal.svelte';
    import FormSection from '@/Components/FormSection.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import SecondaryButton from '@/Components/SecondaryButton.svelte';
    import SectionBorder from '@/Components/SectionBorder.svelte';
    import TextInput from '@/Components/TextInput.svelte';
    import type { Permissions, Role, Team, TeamInvitation, User } from '@/Types';

    export let team: Team;
    export let availableRoles: Role[];
    export let permissions: Permissions;
    export let classes = '';

    const addTeamMemberForm = useForm({
        email: '',
        role: null,
    });

    const updateRoleForm = useForm({
        role: null,
    });

    const leaveTeamForm = useForm({});
    const removeTeamMemberForm = useForm({});

    let currentlyManagingRole = false;
    let managingRoleFor: User | null = null;
    let confirmingLeavingTeam = false;
    let teamMemberBeingRemoved: User | null = null;

    const addTeamMember = () => {
        $addTeamMemberForm.post(`/teams/${team.id}/members`, {
            errorBag: 'addTeamMember',
            preserveScroll: true,
            onSuccess: () => $addTeamMemberForm.reset(),
        });
    };

    const cancelTeamInvitation = (invitation: TeamInvitation) => {
        router.delete(`/team-invitations/${invitation.id}`, {
            preserveScroll: true,
        });
    };

    const manageRole = (teamMember: User) => {
        managingRoleFor = teamMember;
        $updateRoleForm.role = teamMember.membership.role;
        currentlyManagingRole = true;
    };

    const updateRole = () => {
        if (managingRoleFor) {
            $updateRoleForm.put(`/teams/${team.id}/members/${managingRoleFor.id}`, {
                preserveScroll: true,
                onSuccess: () => (currentlyManagingRole = false),
            });
        }
    };

    const confirmLeavingTeam = () => {
        confirmingLeavingTeam = true;
    };

    const leaveTeam = () => {
        $leaveTeamForm.delete(`/teams/${team.id}/members/${$page.props.auth.user.id}`);
    };

    const confirmTeamMemberRemoval = (teamMember: User) => {
        teamMemberBeingRemoved = teamMember;
    };

    const removeTeamMember = () => {
        if (teamMemberBeingRemoved) {
            $removeTeamMemberForm.delete(`/teams/${team.id}/members/${teamMemberBeingRemoved.id}`, {
                errorBag: 'removeTeamMember',
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => (teamMemberBeingRemoved = null),
            });
        }
    };

    const displayableRole = (role: string) => {
        return availableRoles.find((r) => r.key === role)?.name ?? '';
    };
</script>

<div class={classes}>
    {#if permissions.canAddTeamMembers}
        <div>
            <SectionBorder />

            <!-- Add Team Member -->
            <FormSection on:submitted={addTeamMember}>
                <div slot="title" class="contents">Add Team Member</div>

                <div slot="description" class="contents">
                    Add a new team member to your team, allowing them to collaborate with you.
                </div>

                <div slot="form" class="contents">
                    <div class="col-span-6">
                        <div class="max-w-xl text-sm text-gray-600 dark:text-gray-400">
                            Please provide the email address of the person you would like to add to
                            this team.
                        </div>
                    </div>

                    <!-- Member Email -->
                    <div class="col-span-6 sm:col-span-4">
                        <InputLabel forElement="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            bind:value={$addTeamMemberForm.email}
                            error={$addTeamMemberForm.errors.email}
                            classes="mt-1 block w-full"
                        />
                        <InputError message={$addTeamMemberForm.errors.email} classes="mt-2" />
                    </div>

                    <!-- Role -->
                    {#if availableRoles.length > 0}
                        <div class="col-span-6 lg:col-span-4">
                            <InputLabel forElement="roles" value="Role" />
                            <InputError message={$addTeamMemberForm.errors.role} classes="mt-2" />

                            <div
                                class="relative z-0 mt-1 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                {#each availableRoles as role, i (role.key)}
                                    <button
                                        type="button"
                                        class="relative inline-flex w-full rounded-lg px-4 py-3 focus:z-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                        class:border-t={i > 0}
                                        class:border-gray-200={i > 0}
                                        class:dark:border-gray-700={i > 0}
                                        class:focus:border-none={i > 0}
                                        class:rounded-t-none={i > 0}
                                        class:rounded-b-none={i !==
                                            Object.keys(availableRoles).length - 1}
                                        on:click={() => ($addTeamMemberForm.role = role.key)}
                                        data-testid={`${role.key.toLowerCase()}-button`}
                                    >
                                        <div
                                            class:opacity-50={$addTeamMemberForm.role &&
                                                $addTeamMemberForm.role !== role.key}
                                        >
                                            <!-- Role Name -->
                                            <div class="flex items-center">
                                                <div
                                                    class="text-sm text-gray-600 dark:text-gray-400"
                                                    class:font-semibold={$addTeamMemberForm.role ===
                                                        role.key}
                                                >
                                                    {role.name}
                                                </div>

                                                {#if $addTeamMemberForm.role === role.key}
                                                    <svg
                                                        class="ms-2 size-5 text-green-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                {/if}
                                            </div>

                                            <!-- Role Description -->
                                            <div
                                                class="mt-2 text-start text-xs text-gray-600 dark:text-gray-400"
                                            >
                                                {role.description}
                                            </div>
                                        </div>
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>

                <div slot="actions" class="contents">
                    <ActionMessage on={$addTeamMemberForm.recentlySuccessful} classes="me-3">
                        Added.
                    </ActionMessage>

                    <PrimaryButton disabled={$addTeamMemberForm.processing} dataTestId="add-button">
                        Add
                    </PrimaryButton>
                </div>
            </FormSection>
        </div>
    {/if}

    {#if team.team_invitations.length > 0 && permissions.canAddTeamMembers}
        <div>
            <SectionBorder />

            <!-- Team Member Invitations -->
            <ActionSection classes="mt-10 sm:mt-0">
                <div slot="title" class="contents">Pending Team Invitations</div>

                <div slot="description" class="contents">
                    These people have been invited to your team and have been sent an invitation
                    email. They may join the team by accepting the email invitation.
                </div>

                <!-- Pending Team Member Invitation List -->
                <div slot="content" class="contents">
                    <div class="space-y-6">
                        {#each team.team_invitations as invitation (invitation.id)}
                            <div class="flex items-center justify-between">
                                <div class="text-gray-600 dark:text-gray-400">
                                    {invitation.email}
                                </div>

                                <div class="flex items-center">
                                    <!-- Cancel Team Invitation -->
                                    {#if permissions.canRemoveTeamMembers}
                                        <button
                                            class="ms-6 cursor-pointer text-sm text-red-500 focus:outline-none"
                                            on:click={() => {
                                                cancelTeamInvitation(invitation);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </ActionSection>
        </div>
    {/if}

    {#if team.users.length > 0}
        <div>
            <SectionBorder />

            <!-- Manage Team Members -->
            <ActionSection classes="mt-10 sm:mt-0">
                <div slot="title" class="contents">Team Members</div>

                <div slot="description" class="contents">
                    All of the people that are part of this team.
                </div>

                <!-- Team Member List -->
                <div slot="content" class="contents">
                    <div class="space-y-6">
                        {#each team.users as user (user.id)}
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <img
                                        src={user.profile_photo_url}
                                        alt={user.name}
                                        class="size-8 rounded-full object-cover"
                                    />
                                    <div class="ms-4 dark:text-white">
                                        {user.name}
                                    </div>
                                </div>

                                <div class="flex items-center">
                                    <!-- Manage Team Member Role -->
                                    {#if permissions.canUpdateTeamMembers && availableRoles.length}
                                        <button
                                            class="ms-2 text-sm text-gray-400 underline"
                                            on:click={() => {
                                                manageRole(user);
                                            }}
                                        >
                                            {displayableRole(user.membership.role)}
                                        </button>
                                    {:else if availableRoles.length}
                                        <div class="ms-2 text-sm text-gray-400">
                                            {displayableRole(user.membership.role)}
                                        </div>
                                    {/if}

                                    <!-- Leave Team -->
                                    {#if $page.props.auth.user.id === user.id}
                                        <button
                                            class="ms-6 cursor-pointer text-sm text-red-500"
                                            on:click={confirmLeavingTeam}
                                        >
                                            Leave
                                        </button>
                                    {:else if permissions.canRemoveTeamMembers}
                                        <!-- Remove Team Member -->
                                        <button
                                            class="ms-6 cursor-pointer text-sm text-red-500"
                                            on:click={() => {
                                                confirmTeamMemberRemoval(user);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </ActionSection>
        </div>
    {/if}

    <!-- Role Management Modal -->
    <DialogModal show={currentlyManagingRole} on:closed={() => (currentlyManagingRole = false)}>
        <div slot="title" class="contents">Manage Role</div>

        <div slot="content" class="contents">
            {#if managingRoleFor}
                <div>
                    <div
                        class="relative z-0 mt-1 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        {#each availableRoles as role, i (role.key)}
                            <button
                                type="button"
                                class="relative inline-flex w-full rounded-lg px-4 py-3 focus:z-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                class:border-t={i > 0}
                                class:border-gray-200={i > 0}
                                class:dark:border-gray-700={i > 0}
                                class:focus:border-none={i > 0}
                                class:rounded-t-none={i > 0}
                                class:rounded-b-none={i !== Object.keys(availableRoles).length - 1}
                                on:click={() => ($updateRoleForm.role = role.key)}
                            >
                                <div
                                    class:opacity-50={$updateRoleForm.role &&
                                        $updateRoleForm.role !== role.key}
                                >
                                    <!-- Role Name -->
                                    <div class="flex items-center">
                                        <div
                                            class="text-sm text-gray-600 dark:text-gray-400"
                                            class:font-semibold={$updateRoleForm.role === role.key}
                                        >
                                            {role.name}
                                        </div>

                                        {#if $updateRoleForm.role === role.key}
                                            <svg
                                                class="ms-2 size-5 text-green-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        {/if}
                                    </div>

                                    <!-- Role Description -->
                                    <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                        {role.description}
                                    </div>
                                </div>
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>

        <div slot="footer" class="contents">
            <SecondaryButton on:clicked={() => (currentlyManagingRole = false)}
                >Cancel</SecondaryButton
            >

            <PrimaryButton
                type="button"
                classes="ms-3"
                disabled={$updateRoleForm.processing}
                on:clicked={updateRole}
            >
                Save
            </PrimaryButton>
        </div>
    </DialogModal>

    <!-- Leave Team Confirmation Modal -->
    <ConfirmationModal
        show={confirmingLeavingTeam}
        on:closed={() => (confirmingLeavingTeam = false)}
    >
        <div slot="title" class="contents">Leave Team</div>

        <div slot="content" class="contents">Are you sure you would like to leave this team?</div>

        <div slot="footer" class="contents">
            <SecondaryButton on:clicked={() => (confirmingLeavingTeam = false)}
                >Cancel</SecondaryButton
            >

            <DangerButton
                classes="ms-3"
                disabled={$leaveTeamForm.processing}
                on:clicked={leaveTeam}
            >
                Leave
            </DangerButton>
        </div>
    </ConfirmationModal>

    <!-- Remove Team Member Confirmation Modal -->
    <ConfirmationModal
        show={!!teamMemberBeingRemoved}
        on:closed={() => (teamMemberBeingRemoved = null)}
    >
        <div slot="title" class="contents">Remove Team Member</div>

        <div slot="content" class="contents">
            Are you sure you would like to remove this person from the team?
        </div>

        <div slot="footer" class="contents">
            <SecondaryButton on:clicked={() => (teamMemberBeingRemoved = null)}
                >Cancel</SecondaryButton
            >

            <DangerButton
                classes="ms-3"
                disabled={$removeTeamMemberForm.processing}
                on:clicked={removeTeamMember}
            >
                Remove
            </DangerButton>
        </div>
    </ConfirmationModal>
</div>
