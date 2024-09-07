<script lang="ts">
    import { createEventDispatcher, tick } from 'svelte';
    import { useForm } from '@inertiajs/svelte';
    import axios from 'axios';
    import DialogModal from './DialogModal.svelte';
    import InputError from './InputError.svelte';
    import PrimaryButton from './PrimaryButton.svelte';
    import SecondaryButton from './SecondaryButton.svelte';
    import TextInput from './TextInput.svelte';

    export let title = 'Confirm Password';
    export let content = 'For your security, please confirm your password to continue.';
    export let button = 'Confirm';

    const dispatch = createEventDispatcher();

    const form = useForm({
        password: '',
        error: '',
        processing: false,
    });

    let confirmingPassword = false;
    let passwordInput: TextInput;

    const startConfirmingPassword = () => {
        axios.get('/user/confirmed-password-status').then((response) => {
            if (response.data.confirmed) {
                dispatch('confirmed');
            } else {
                confirmingPassword = true;

                setTimeout(() => passwordInput.focus(), 250);
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
                tick().then(() => dispatch('confirmed'));
            })
            .catch((error) => {
                $form.processing = false;
                $form.error = error.response.data.errors.password[0];
                passwordInput.focus();
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
        on:click={startConfirmingPassword}
        on:keydown={startConfirmingPassword}
        role="button"
        tabindex="0"
    >
        <slot />
    </span>

    <DialogModal show={confirmingPassword} on:closed={closeModal}>
        <div slot="title" class="contents">
            {title}
        </div>

        <div slot="content" class="contents">
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
                    on:entered={confirmPassword}
                    data-testid="confirms-password-form-password"
                />

                <InputError message={$form.error} classes="mt-2" />
            </div>
        </div>

        <div slot="footer" class="contents">
            <SecondaryButton on:clicked={closeModal}>Cancel</SecondaryButton>

            <PrimaryButton
                type="button"
                classes="ms-3"
                disabled={$form.processing}
                on:clicked={confirmPassword}
            >
                {button}
            </PrimaryButton>
        </div>
    </DialogModal>
</span>
