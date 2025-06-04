<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import ActionMessage from '@/Components/ActionMessage.svelte';
    import FormSection from '@/Components/FormSection.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    interface Props {
        classes?: string;
    }

    let { classes = '' }: Props = $props();

    let passwordInput: TextInput | undefined = $state();
    let currentPasswordInput: TextInput | undefined = $state();

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = () => {
        $form.put('/user/password', {
            errorBag: 'updatePassword',
            preserveScroll: true,
            onSuccess: () => $form.reset(),
            onError: () => {
                if ($form.errors.password) {
                    $form.reset('password', 'password_confirmation');
                    passwordInput?.focus();
                }

                if ($form.errors.current_password) {
                    $form.reset('current_password');
                    currentPasswordInput?.focus();
                }
            },
        });
    };
</script>

<FormSection {classes} submitted={updatePassword}>
    {#snippet formSectionTitle()}
        <div class="contents">Update Password</div>
    {/snippet}

    {#snippet formSectionDescription()}
        <div class="contents">
            Ensure your account is using a long, random password to stay secure.
        </div>
    {/snippet}

    {#snippet formSectionForm()}
        <div class="contents">
            <div class="col-span-6 sm:col-span-4">
                <InputLabel forElement="current_password" value="Current Password" />
                <TextInput
                    id="current_password"
                    type="password"
                    bind:this={currentPasswordInput}
                    bind:value={$form.current_password}
                    error={$form.errors.current_password}
                    classes="mt-1 block w-full"
                    autocomplete="current-password"
                />
                <InputError message={$form.errors.current_password} classes="mt-2" />
            </div>

            <div class="col-span-6 sm:col-span-4">
                <InputLabel forElement="password" value="New Password" />
                <TextInput
                    id="password"
                    type="password"
                    bind:this={passwordInput}
                    bind:value={$form.password}
                    error={$form.errors.password}
                    classes="mt-1 block w-full"
                    autocomplete="new-password"
                />
                <InputError message={$form.errors.password} classes="mt-2" />
            </div>

            <div class="col-span-6 sm:col-span-4">
                <InputLabel forElement="password_confirmation" value="Confirm Password" />
                <TextInput
                    id="password_confirmation"
                    type="password"
                    bind:value={$form.password_confirmation}
                    error={$form.errors.password_confirmation}
                    classes="mt-1 block w-full"
                    autocomplete="new-password"
                />
                <InputError message={$form.errors.password_confirmation} classes="mt-2" />
            </div>
        </div>
    {/snippet}

    {#snippet formSectionActions()}
        <div class="contents">
            <ActionMessage on={$form.recentlySuccessful} classes="me-3">Saved.</ActionMessage>

            <PrimaryButton disabled={$form.processing} dataTestId="update-password-button">
                Save
            </PrimaryButton>
        </div>
    {/snippet}
</FormSection>
