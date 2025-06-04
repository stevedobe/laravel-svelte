<script lang="ts">
    import { tick } from 'svelte';
    import { useForm } from '@inertiajs/svelte';
    import AuthenticationCard from '@/Components/AuthenticationCard.svelte';
    import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    const form = useForm({
        code: '',
        recovery_code: '',
    });

    let recovery = $state(false);
    let recoveryCodeInput: TextInput | undefined = $state();
    let codeInput: TextInput | undefined = $state();

    const toggleRecovery = async (event: Event) => {
        event.preventDefault();

        recovery = !recovery;

        await tick();

        if (recovery) {
            recoveryCodeInput?.focus();
            $form.code = '';
        } else {
            codeInput?.focus();
            $form.recovery_code = '';
        }
    };

    const submit = (event: Event) => {
        event.preventDefault();

        $form.post('/two-factor-challenge');
    };
</script>

<Helmet title="Two-factor Confirmation" />

<AuthenticationCard>
    {#snippet authenticationCardLogo()}
        <div class="contents">
            <AuthenticationCardLogo />
        </div>
    {/snippet}

    <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {#if !recovery}
            Please confirm access to your account by entering the authentication code provided by
            your authenticator application.
        {:else}
            Please confirm access to your account by entering one of your emergency recovery codes.
        {/if}
    </div>

    <form onsubmit={submit}>
        {#if !recovery}
            <div>
                <InputLabel forElement="code" value="Code" />
                <TextInput
                    id="code"
                    bind:this={codeInput}
                    bind:value={$form.code}
                    error={$form.errors.code}
                    inputmode="numeric"
                    classes="mt-1 block w-full"
                    autofocus
                    autocomplete="one-time-code"
                />
                <InputError classes="mt-2" message={$form.errors.code} />
            </div>
        {:else}
            <div>
                <InputLabel forElement="recovery_code" value="Recovery Code" />
                <TextInput
                    id="recovery_code"
                    bind:this={recoveryCodeInput}
                    bind:value={$form.recovery_code}
                    error={$form.errors.recovery_code}
                    classes="mt-1 block w-full"
                    autocomplete="one-time-code"
                />
                <InputError classes="mt-2" message={$form.errors.recovery_code} />
            </div>
        {/if}

        <div class="mt-4 flex items-center justify-end">
            <button
                type="button"
                class="cursor-pointer text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400"
                onclick={toggleRecovery}
            >
                {#if !recovery}
                    Use a recovery code
                {:else}
                    Use an authentication code
                {/if}
            </button>

            <PrimaryButton classes="ms-4" disabled={$form.processing}>Log in</PrimaryButton>
        </div>
    </form>
</AuthenticationCard>
