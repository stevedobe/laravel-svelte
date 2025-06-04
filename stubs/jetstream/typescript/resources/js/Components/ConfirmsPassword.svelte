<script lang="ts">
    import { tick } from 'svelte';
    import { useForm } from '@inertiajs/svelte';
    import axios from 'axios';
    import DialogModal from './DialogModal.svelte';
    import InputError from './InputError.svelte';
    import PrimaryButton from './PrimaryButton.svelte';
    import SecondaryButton from './SecondaryButton.svelte';
    import TextInput from './TextInput.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        title?: string;
        content?: string;
        button?: string;
        children?: Snippet;
        confirmed?: () => void;
    }

    let {
        title = 'Confirm Password',
        content = 'For your security, please confirm your password to continue.',
        button = 'Confirm',
        children,
        confirmed = () => {
            // Do nothing by default
        },
    }: Props = $props();

    const form = useForm({
        password: '',
        error: '',
        processing: false,
    });

    let confirmingPassword = $state(false);
    let passwordInput: TextInput | undefined = $state();

    const startConfirmingPassword = () => {
        axios.get('/user/confirmed-password-status').then((response) => {
            if (response.data.confirmed) {
                confirmed?.();
            } else {
                confirmingPassword = true;

                setTimeout(() => passwordInput?.focus(), 250);
            }
        });
    };

    const confirmPassword = () => {
        $form.processing = true;

        axios
            .post('/user/confirm-password', {
                password: $form.password,
            })
            .then(() => {
                $form.processing = false;

                closeModal();
                tick().then(() => confirmed?.());
            })
            .catch((error) => {
                $form.processing = false;
                $form.error = error.response.data.errors.password[0];
                passwordInput?.focus();
            });
    };

    const closeModal = () => {
        confirmingPassword = false;
        $form.password = '';
        $form.error = '';
    };
</script>

<span>
    <span
        onclick={startConfirmingPassword}
        onkeydown={startConfirmingPassword}
        role="button"
        tabindex="0"
    >
        {@render children?.()}
    </span>

    <DialogModal show={confirmingPassword} closed={closeModal}>
        {#snippet dialogModalTitle()}
            <div class="contents">
                {title}
            </div>
        {/snippet}

        {#snippet dialogModalContent()}
            <div class="contents">
                {content}

                <div class="mt-4">
                    <TextInput
                        type="password"
                        bind:this={passwordInput}
                        bind:value={$form.password}
                        error={$form.error}
                        classes="mt-1 block w-3/4"
                        placeholder="Password"
                        autocomplete="current-password"
                        entered={confirmPassword}
                        dataTestId="confirms-password-form-password"
                    />

                    <InputError message={$form.error} classes="mt-2" />
                </div>
            </div>
        {/snippet}

        {#snippet dialogModalFooter()}
            <div class="contents">
                <SecondaryButton clicked={closeModal}>Cancel</SecondaryButton>

                <PrimaryButton
                    type="button"
                    classes="ms-3"
                    disabled={$form.processing}
                    clicked={confirmPassword}
                >
                    {button}
                </PrimaryButton>
            </div>
        {/snippet}
    </DialogModal>
</span>
