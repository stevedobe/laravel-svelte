<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import ActionSection from '@/Components/ActionSection.svelte';
    import ConfirmationModal from '@/Components/ConfirmationModal.svelte';
    import DangerButton from '@/Components/DangerButton.svelte';
    import SecondaryButton from '@/Components/SecondaryButton.svelte';
    import type { Team } from '@/Types';

    interface Props {
        team: Team;
        classes?: string;
    }

    let { team, classes = '' }: Props = $props();

    const form = useForm({});

    let confirmingTeamDeletion = $state(false);

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
    {#snippet actionSectionTitle()}
        <div class="contents">Delete Team</div>
    {/snippet}

    {#snippet actionSectionDescription()}
        <div class="contents">Permanently delete this team.</div>
    {/snippet}

    {#snippet actionSectionContent()}
        <div class="contents">
            <div class="max-w-xl text-sm text-gray-600 dark:text-gray-400">
                Once a team is deleted, all of its resources and data will be permanently deleted.
                Before deleting this team, please download any data or information regarding this
                team that you wish to retain.
            </div>

            <div class="mt-5">
                <DangerButton clicked={confirmTeamDeletion}>Delete Team</DangerButton>
            </div>

            <!-- Delete Team Confirmation Modal -->
            <ConfirmationModal
                show={confirmingTeamDeletion}
                closed={() => (confirmingTeamDeletion = false)}
            >
                {#snippet confirmationModalTitle()}
                    <div class="contents">Delete Team</div>
                {/snippet}

                {#snippet confirmationModalContent()}
                    <div class="contents">
                        Are you sure you want to delete this team? Once a team is deleted, all of
                        its resources and data will be permanently deleted.
                    </div>
                {/snippet}

                {#snippet confirmationModalFooter()}
                    <div class="contents">
                        <SecondaryButton clicked={() => (confirmingTeamDeletion = false)}>
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            classes="ms-3"
                            disabled={$form.processing}
                            clicked={deleteTeam}
                        >
                            Delete Team
                        </DangerButton>
                    </div>
                {/snippet}
            </ConfirmationModal>
        </div>
    {/snippet}
</ActionSection>
