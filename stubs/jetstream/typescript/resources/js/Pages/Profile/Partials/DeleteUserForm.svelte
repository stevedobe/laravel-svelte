<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import ActionSection from '@/Components/ActionSection.svelte';
    import DangerButton from '@/Components/DangerButton.svelte';
    import DialogModal from '@/Components/DialogModal.svelte';
    import InputError from '@/Components/InputError.svelte';
    import SecondaryButton from '@/Components/SecondaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    export let classes = '';

    let confirmingUserDeletion = false;
    let passwordInput: TextInput;

    const form = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        confirmingUserDeletion = true;

        setTimeout(() => passwordInput.focus(), 250);
    };

    const deleteUser = () => {
        $form.delete('/user', {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onError: () => passwordInput.focus(),
            onFinish: () => $form.reset(),
        });
    };

    const closeModal = () => {
        confirmingUserDeletion = false;

        $form.reset();
    };
</script>

<ActionSection {classes}>
    <div slot="title" class="contents">Delete Account</div>

    <div slot="description" class="contents">Permanently delete your account.</div>

    <div slot="content" class="contents">
        <div class="max-w-xl text-sm text-gray-600 dark:text-gray-400">
            Once your account is deleted, all of its resources and data will be permanently deleted.
            Before deleting your account, please download any data or information that you wish to
            retain.
        </div>

        <div class="mt-5">
            <DangerButton on:clicked={confirmUserDeletion} dataCy="delete-account-button">
                Delete Account
            </DangerButton>
        </div>

        <!-- Delete Account Confirmation Modal -->
        <DialogModal show={confirmingUserDeletion} on:closed={closeModal}>
            <div slot="title" class="contents">Delete Account</div>

            <div slot="content" class="contents">
                Are you sure you want to delete your account? Once your account is deleted, all of
                its resources and data will be permanently deleted. Please enter your password to
                confirm you would like to permanently delete your account.

                <div class="mt-4">
                    <TextInput
                        type="password"
                        bind:this={passwordInput}
                        bind:value={$form.password}
                        error={$form.errors.password}
                        classes="mt-1 block w-3/4"
                        placeholder="Password"
                        autocomplete="current-password"
                        on:entered={deleteUser}
                        data-cy="delete-user-form-password"
                    />

                    <InputError message={$form.errors.password} classes="mt-2" />
                </div>
            </div>

            <div slot="footer" class="contents">
                <SecondaryButton on:clicked={closeModal}>Cancel</SecondaryButton>

                <DangerButton classes="ms-3" disabled={$form.processing} on:clicked={deleteUser}>
                    Delete Account
                </DangerButton>
            </div>
        </DialogModal>
    </div>
</ActionSection>
