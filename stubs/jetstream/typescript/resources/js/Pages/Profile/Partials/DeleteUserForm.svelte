<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import ActionSection from '@/Components/ActionSection.svelte';
    import DangerButton from '@/Components/DangerButton.svelte';
    import DialogModal from '@/Components/DialogModal.svelte';
    import InputError from '@/Components/InputError.svelte';
    import SecondaryButton from '@/Components/SecondaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    interface Props {
        classes?: string;
    }

    let { classes = '' }: Props = $props();

    let confirmingUserDeletion = $state(false);
    let passwordInput: TextInput | undefined = $state();

    const form = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        confirmingUserDeletion = true;

        setTimeout(() => passwordInput?.focus(), 250);
    };

    const deleteUser = () => {
        $form.delete('/user', {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onError: () => passwordInput?.focus(),
            onFinish: () => $form.reset(),
        });
    };

    const closeModal = () => {
        confirmingUserDeletion = false;

        $form.reset();
    };
</script>

<ActionSection {classes}>
    {#snippet actionSectionTitle()}
        <div class="contents">Delete Account</div>
    {/snippet}

    {#snippet actionSectionDescription()}
        <div class="contents">Permanently delete your account.</div>
    {/snippet}

    {#snippet actionSectionContent()}
        <div class="contents">
            <div class="max-w-xl text-sm text-gray-600 dark:text-gray-400">
                Once your account is deleted, all of its resources and data will be permanently
                deleted. Before deleting your account, please download any data or information that
                you wish to retain.
            </div>

            <div class="mt-5">
                <DangerButton clicked={confirmUserDeletion} dataTestId="delete-account-button">
                    Delete Account
                </DangerButton>
            </div>

            <!-- Delete Account Confirmation Modal -->
            <DialogModal show={confirmingUserDeletion} closed={closeModal}>
                {#snippet dialogModalTitle()}
                    <div class="contents">Delete Account</div>
                {/snippet}

                {#snippet dialogModalContent()}
                    <div class="contents">
                        Are you sure you want to delete your account? Once your account is deleted,
                        all of its resources and data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete your account.

                        <div class="mt-4">
                            <TextInput
                                type="password"
                                bind:this={passwordInput}
                                bind:value={$form.password}
                                error={$form.errors.password}
                                classes="mt-1 block w-3/4"
                                placeholder="Password"
                                autocomplete="current-password"
                                entered={deleteUser}
                                dataTestId="delete-user-form-password"
                            />

                            <InputError message={$form.errors.password} classes="mt-2" />
                        </div>
                    </div>
                {/snippet}

                {#snippet dialogModalFooter()}
                    <div class="contents">
                        <SecondaryButton clicked={closeModal}>Cancel</SecondaryButton>

                        <DangerButton
                            classes="ms-3"
                            disabled={$form.processing}
                            clicked={deleteUser}
                        >
                            Delete Account
                        </DangerButton>
                    </div>
                {/snippet}
            </DialogModal>
        </div>
    {/snippet}
</ActionSection>
