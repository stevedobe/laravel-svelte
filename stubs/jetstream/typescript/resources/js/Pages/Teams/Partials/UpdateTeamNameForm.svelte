<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import ActionMessage from '@/Components/ActionMessage.svelte';
    import FormSection from '@/Components/FormSection.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';
    import type { Permissions, Team } from '@/Types';

    export let team: Team;
    export let permissions: Permissions;

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

<FormSection on:submitted={updateTeamName}>
    <div slot="title" class="contents">Team Name</div>

    <div slot="description" class="contents">The team's name and owner information.</div>

    <div slot="form" class="contents">
        <!-- Team Owner Information -->
        <div class="col-span-6">
            <InputLabel forElement="" value="Team Owner" />

            <div class="mt-2 flex items-center">
                <img
                    src={team.owner.profile_photo_url}
                    alt={team.owner.name}
                    class="h-12 w-12 rounded-full object-cover"
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

    <div slot="actions" class="contents">
        {#if permissions.canUpdateTeam}
            <ActionMessage on={$form.recentlySuccessful} classes="me-3">Saved.</ActionMessage>

            <PrimaryButton disabled={$form.processing} dataTestId="save-button">Save</PrimaryButton>
        {/if}
    </div>
</FormSection>
