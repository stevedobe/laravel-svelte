<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import ActionSection from '@/Components/ActionSection.svelte';
    import ConfirmationModal from '@/Components/ConfirmationModal.svelte';
    import DangerButton from '@/Components/DangerButton.svelte';
    import SecondaryButton from '@/Components/SecondaryButton.svelte';
    import type { Team } from '@/Types';

    export let team: Team;
    export let classes = '';

    const form = useForm({});

    let confirmingTeamDeletion = false;

    const confirmTeamDeletion = () => {
        confirmingTeamDeletion = true;
    };

    const deleteTeam = () => {
        $form.delete(`/teams/${team.id}`, {
            errorBag: 'deleteTeam',
        });
    };
</script>

<ActionSection {classes}>
    <div slot="title" class="contents">Delete Team</div>

    <div slot="description" class="contents">Permanently delete this team.</div>

    <div slot="content" class="contents">
        <div class="max-w-xl text-sm text-gray-600 dark:text-gray-400">
            Once a team is deleted, all of its resources and data will be permanently deleted.
            Before deleting this team, please download any data or information regarding this team
            that you wish to retain.
        </div>

        <div class="mt-5">
            <DangerButton on:clicked={confirmTeamDeletion}>Delete Team</DangerButton>
        </div>

        <!-- Delete Team Confirmation Modal -->
        <ConfirmationModal
            show={confirmingTeamDeletion}
            on:closed={() => (confirmingTeamDeletion = false)}
        >
            <div slot="title" class="contents">Delete Team</div>

            <div slot="content" class="contents">
                Are you sure you want to delete this team? Once a team is deleted, all of its
                resources and data will be permanently deleted.
            </div>

            <div slot="footer" class="contents">
                <SecondaryButton on:clicked={() => (confirmingTeamDeletion = false)}>
                    Cancel
                </SecondaryButton>

                <DangerButton classes="ms-3" disabled={$form.processing} on:clicked={deleteTeam}>
                    Delete Team
                </DangerButton>
            </div>
        </ConfirmationModal>
    </div>
</ActionSection>
