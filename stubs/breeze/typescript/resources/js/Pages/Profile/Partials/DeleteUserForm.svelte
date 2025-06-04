<script lang="ts">
    import { tick } from 'svelte';
    import { useForm } from '@inertiajs/svelte';
    import DangerButton from '@/Components/DangerButton.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import Modal from '@/Components/Modal.svelte';
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

        tick().then(() => passwordInput?.focus());
    };

    const deleteUser = (event?: KeyboardEvent) => {
        // If the event object is passed (e.g., from TextInput's 'entered' prop),
        // stop it from bubbling up to parent elements like the modal backdrop.
        event?.stopPropagation();

        $form.delete('/profile', {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput?.focus(),
            onFinish: () => {
                $form.reset();
            },
        });
    };

    const closeModal = () => {
        confirmingUserDeletion = false;

        $form.clearErrors();
        $form.reset();
    };
</script>

<section class="space-y-6 {classes}">
    <header>
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Delete Account</h2>

        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Once your account is deleted, all of its resources and data will be permanently deleted.
            Before deleting your account, please download any data or information that you wish to
            retain.
        </p>
    </header>

    <DangerButton clicked={confirmUserDeletion} dataTestId="delete-account-button">
        Delete Account
    </DangerButton>

    <Modal show={confirmingUserDeletion} closed={closeModal}>
        <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                Are you sure you want to delete your account?
            </h2>

            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Once your account is deleted, all of its resources and data will be permanently
                deleted. Please enter your password to confirm you would like to permanently delete
                your account.
            </p>

            <form
                onsubmit={(event: SubmitEvent) => {
                    event.preventDefault();

                    deleteUser();
                }}
            >
                <div class="mt-6">
                    <InputLabel forElement="password" value="Password" classes="sr-only" />

                    <TextInput
                        id="password"
                        type="password"
                        bind:this={passwordInput}
                        bind:value={$form.password}
                        error={$form.errors.password}
                        classes="mt-1 block w-3/4"
                        placeholder="Password"
                        entered={deleteUser}
                        dataTestId="delete-user-form-password"
                    />

                    <InputError message={$form.errors.password} classes="mt-2" />
                </div>

                <div class="mt-6 flex justify-end">
                    <SecondaryButton clicked={closeModal}>Cancel</SecondaryButton>

                    <DangerButton
                        type="submit"
                        clicked={deleteUser}
                        disabled={$form.processing}
                        classes="ms-3"
                    >
                        Delete Account
                    </DangerButton>
                </div>
            </form>
        </div>
    </Modal>
</section>
