<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import ActionMessage from '@/Components/ActionMessage.svelte';
    import FormSection from '@/Components/FormSection.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';
    import type { Permissions, Team } from '@/Types';

    interface Props {
        team: Team;
        permissions: Permissions;
    }

    let { team, permissions }: Props = $props();

    const form = useForm({
        name: team.name,
    });

    const updateTeamName = () => {
        $form.put(`/teams/${team.id}`, {
            errorBag: 'updateTeamName',
            preserveScroll: true,
        });
    };
</script>

<FormSection submitted={updateTeamName}>
    {#snippet formSectionTitle()}
        <div class="contents">Team Name</div>
    {/snippet}

    {#snippet formSectionDescription()}
        <div class="contents">The team's name and owner information.</div>
    {/snippet}

    {#snippet formSectionForm()}
        <div class="contents">
            <!-- Team Owner Information -->
            <div class="col-span-6">
                <InputLabel forElement="" value="Team Owner" />

                <div class="mt-2 flex items-center">
                    <img
                        src={team.owner.profile_photo_url}
                        alt={team.owner.name}
                        class="size-12 rounded-full object-cover"
                    />

                    <div class="ms-4 leading-tight">
                        <div class="text-gray-900 dark:text-white">{team.owner.name}</div>
                        <div class="text-sm text-gray-700 dark:text-gray-300">
                            {team.owner.email}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Team Name -->
            <div class="col-span-6 sm:col-span-4">
                <InputLabel forElement="name" value="Team Name" />

                <TextInput
                    id="name"
                    bind:value={$form.name}
                    error={$form.errors.name}
                    classes="mt-1 block w-full"
                    disabled={!permissions.canUpdateTeam}
                />

                <InputError message={$form.errors.name} classes="mt-2" />
            </div>
        </div>
    {/snippet}

    {#snippet formSectionActions()}
        <div class="contents">
            {#if permissions.canUpdateTeam}
                <ActionMessage on={$form.recentlySuccessful} classes="me-3">Saved.</ActionMessage>

                <PrimaryButton disabled={$form.processing} dataTestId="save-button"
                    >Save</PrimaryButton
                >
            {/if}
        </div>
    {/snippet}
</FormSection>
