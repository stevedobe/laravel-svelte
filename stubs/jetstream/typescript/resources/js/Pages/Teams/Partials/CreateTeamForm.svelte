<script lang="ts">
    import { page, useForm } from '@inertiajs/svelte';
    import FormSection from '@/Components/FormSection.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    const form = useForm({
        name: '',
    });

    let user = $page.props.auth.user;

    const createTeam = () => {
        $form.post('/teams', {
            errorBag: 'createTeam',
            preserveScroll: true,
        });
    };
</script>

<FormSection submitted={createTeam}>
    {#snippet formSectionTitle()}
        <div class="contents">Team Details</div>
    {/snippet}

    {#snippet formSectionDescription()}
        <div class="contents">Create a new team to collaborate with others on projects.</div>
    {/snippet}

    {#snippet formSectionForm()}
        <div class="contents">
            <div class="col-span-6">
                <InputLabel forElement="" value="Team Owner" />

                <div class="mt-2 flex items-center">
                    <img
                        src={user.profile_photo_url}
                        alt={user.name}
                        class="size-12 rounded-full object-cover"
                    />

                    <div class="ms-4 leading-tight">
                        <div class="text-gray-900 dark:text-white">
                            {user.name}
                        </div>

                        <div class="text-sm text-gray-700 dark:text-gray-300">
                            {user.email}
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-6 sm:col-span-4">
                <InputLabel forElement="name" value="Team Name" />
                <TextInput
                    id="name"
                    bind:value={$form.name}
                    error={$form.errors.name}
                    classes="mt-1 block w-full"
                    autofocus
                />
                <InputError message={$form.errors.name} classes="mt-2" />
            </div>
        </div>
    {/snippet}

    {#snippet formSectionActions()}
        <div class="contents">
            <PrimaryButton disabled={$form.processing} dataTestId="create-button"
                >Create</PrimaryButton
            >
        </div>
    {/snippet}
</FormSection>
