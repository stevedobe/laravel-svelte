<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import AuthenticationCard from '@/Components/AuthenticationCard.svelte';
    import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    const form = useForm({
        password: '',
    });

    let passwordInput: TextInput | undefined = $state();

    const submit = (event: Event) => {
        event.preventDefault();

        $form.post('/user/confirm-password', {
            onFinish: () => {
                $form.reset();

                passwordInput?.focus();
            },
        });
    };
</script>

<Helmet title="Secure Area" />

<AuthenticationCard>
    {#snippet authenticationCardLogo()}
        <div class="contents">
            <AuthenticationCardLogo />
        </div>
    {/snippet}

    <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        This is a secure area of the application. Please confirm your password before continuing.
    </div>

    <form onsubmit={submit}>
        <div>
            <InputLabel forElement="password" value="Password" />
            <TextInput
                id="password"
                type="password"
                bind:this={passwordInput}
                bind:value={$form.password}
                error={$form.errors.password}
                classes="mt-1 block w-full"
                required
                autocomplete="current-password"
                autofocus
            />
            <InputError classes="mt-2" message={$form.errors.password} />
        </div>

        <div class="mt-4 flex justify-end">
            <PrimaryButton classes="ms-4" disabled={$form.processing}>Confirm</PrimaryButton>
        </div>
    </form>
</AuthenticationCard>
