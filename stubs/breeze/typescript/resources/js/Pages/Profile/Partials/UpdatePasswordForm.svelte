<script lang="ts">
    import { fade } from 'svelte/transition';
    import { useForm } from '@inertiajs/svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    export let classes = '';

    let passwordInput: TextInput;
    let currentPasswordInput: TextInput;

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = () => {
        $form.put('/password', {
            preserveScroll: true,
            onSuccess: () => {
                $form.reset();
            },
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

<section class={classes}>
    <header>
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Update Password</h2>

        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Ensure your account is using a long, random password to stay secure.
        </p>
    </header>

    <form on:submit|preventDefault={updatePassword} class="mt-6 space-y-6">
        <div>
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

        <div>
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

        <div>
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

        <div class="flex items-center gap-4">
            <PrimaryButton disabled={$form.processing} dataCy="update-password-button">
                Save
            </PrimaryButton>

            <div transition:fade>
                <p
                    class="text-sm text-gray-600 dark:text-gray-400"
                    class:hidden={!$form.recentlySuccessful}
                >
                    Saved.
                </p>
            </div>
        </div>
    </form>
</section>
