<script lang="ts">
    import { page, router, useForm } from '@inertiajs/svelte';
    import axios from 'axios';
    import ActionSection from '@/Components/ActionSection.svelte';
    import ConfirmsPassword from '@/Components/ConfirmsPassword.svelte';
    import DangerButton from '@/Components/DangerButton.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import SecondaryButton from '@/Components/SecondaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    interface Props {
        requiresConfirmation: boolean;
        classes?: string;
    }

    let { requiresConfirmation, classes = '' }: Props = $props();

    /* eslint svelte/no-at-html-tags: "off" */

    let enabling = $state(false);
    let confirming = $state(false);
    let disabling = $state(false);
    let qrCode: string | null = $state(null);
    let setupKey: string | null = $state(null);
    let recoveryCodes: string[] = $state([]);

    const confirmationForm = useForm({
        code: '',
    });

    let twoFactorEnabled = $derived(!enabling && $page.props.auth.user?.two_factor_enabled);

    $effect(() => {
        if (!twoFactorEnabled) {
            $confirmationForm.reset();
            $confirmationForm.clearErrors();
        }
    });

    const enableTwoFactorAuthentication = () => {
        enabling = true;

        router.post(
            '/user/two-factor-authentication',
            {},
            {
                preserveScroll: true,
                onSuccess: () => Promise.all([showQrCode(), showSetupKey(), showRecoveryCodes()]),
                onFinish: () => {
                    enabling = false;
                    confirming = requiresConfirmation;
                },
            },
        );
    };

    const showQrCode = async () => {
        const response = await axios.get('/user/two-factor-qr-code');
        qrCode = response.data.svg;
    };

    const showSetupKey = async () => {
        const response = await axios.get('/user/two-factor-secret-key');
        setupKey = response.data.secretKey;
    };

    const showRecoveryCodes = async () => {
        const response = await axios.get('/user/two-factor-recovery-codes');
        recoveryCodes = response.data;
    };

    const confirmTwoFactorAuthentication = () => {
        $confirmationForm.post('/user/confirmed-two-factor-authentication', {
            errorBag: 'confirmTwoFactorAuthentication',
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                confirming = false;
                qrCode = null;
                setupKey = null;
            },
        });
    };

    const regenerateRecoveryCodes = () => {
        axios.post('/user/two-factor-recovery-codes').then(() => showRecoveryCodes());
    };

    const disableTwoFactorAuthentication = () => {
        disabling = true;

        router.delete('/user/two-factor-authentication', {
            preserveScroll: true,
            onSuccess: () => {
                disabling = false;
                confirming = false;
            },
        });
    };
</script>

<ActionSection {classes}>
    {#snippet actionSectionTitle()}
        <div class="contents">Two Factor Authentication</div>
    {/snippet}

    {#snippet actionSectionDescription()}
        <div class="contents">
            Add additional security to your account using two factor authentication.
        </div>
    {/snippet}

    {#snippet actionSectionContent()}
        <div class="contents">
            {#if twoFactorEnabled && !confirming}
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    You have enabled two factor authentication.
                </h3>
            {:else if twoFactorEnabled && confirming}
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Finish enabling two factor authentication.
                </h3>
            {:else}
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    You have not enabled two factor authentication.
                </h3>
            {/if}

            <div class="mt-3 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                <p>
                    When two factor authentication is enabled, you will be prompted for a secure,
                    random token during authentication. You may retrieve this token from your
                    phone's Google Authenticator application.
                </p>
            </div>

            {#if twoFactorEnabled}
                <div>
                    {#if qrCode}
                        <div>
                            <div class="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                                {#if confirming}
                                    <p class="font-semibold">
                                        To finish enabling two factor authentication, scan the
                                        following QR code using your phone's authenticator
                                        application or enter the setup key and provide the generated
                                        OTP code.
                                    </p>
                                {:else}
                                    <p>
                                        Two factor authentication is now enabled. Scan the following
                                        QR code using your phone's authenticator application or
                                        enter the setup key.
                                    </p>
                                {/if}
                            </div>

                            <div class="mt-4 inline-block bg-white p-2">
                                {@html qrCode}
                            </div>

                            {#if setupKey}
                                <div class="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                                    <p class="font-semibold">
                                        Setup Key: <span>{@html setupKey}</span>
                                    </p>
                                </div>
                            {/if}

                            {#if confirming}
                                <div class="mt-4">
                                    <InputLabel forElement="code" value="Code" />

                                    <TextInput
                                        id="code"
                                        name="code"
                                        bind:value={$confirmationForm.code}
                                        error={$confirmationForm.errors.code}
                                        classes="mt-1 block w-1/2"
                                        inputmode="numeric"
                                        autofocus
                                        autocomplete="one-time-code"
                                        entered={confirmTwoFactorAuthentication}
                                    />

                                    <InputError
                                        message={$confirmationForm.errors.code}
                                        classes="mt-2"
                                    />
                                </div>
                            {/if}
                        </div>
                    {/if}

                    {#if recoveryCodes.length > 0 && !confirming}
                        <div>
                            <div class="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                                <p class="font-semibold">
                                    Store these recovery codes in a secure password manager. They
                                    can be used to recover access to your account if your two factor
                                    authentication device is lost.
                                </p>
                            </div>

                            <div
                                class="mt-4 grid max-w-xl gap-1 rounded-lg bg-gray-100 px-4 py-4 font-mono text-sm dark:bg-gray-900 dark:text-gray-100"
                            >
                                {#each recoveryCodes as code}
                                    <div>
                                        {code}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}

            <div class="mt-5">
                {#if !twoFactorEnabled}
                    <div>
                        <ConfirmsPassword confirmed={enableTwoFactorAuthentication}>
                            <PrimaryButton
                                type="button"
                                disabled={enabling}
                                dataTestId="two-factor-authentication-button"
                            >
                                Enable
                            </PrimaryButton>
                        </ConfirmsPassword>
                    </div>
                {:else}
                    <div>
                        <ConfirmsPassword confirmed={confirmTwoFactorAuthentication}>
                            {#if confirming}
                                <PrimaryButton type="button" classes="me-3" disabled={enabling}>
                                    Confirm
                                </PrimaryButton>
                            {/if}
                        </ConfirmsPassword>

                        <ConfirmsPassword confirmed={regenerateRecoveryCodes}>
                            {#if recoveryCodes.length > 0 && !confirming}
                                <SecondaryButton classes="me-3">
                                    Regenerate Recovery Codes
                                </SecondaryButton>
                            {/if}
                        </ConfirmsPassword>

                        <ConfirmsPassword confirmed={showRecoveryCodes}>
                            {#if recoveryCodes.length === 0 && !confirming}
                                <SecondaryButton classes="me-3">Show Recovery Codes</SecondaryButton
                                >
                            {/if}
                        </ConfirmsPassword>

                        <ConfirmsPassword confirmed={disableTwoFactorAuthentication}>
                            {#if confirming}
                                <SecondaryButton disabled={disabling}>Cancel</SecondaryButton>
                            {/if}
                        </ConfirmsPassword>

                        <ConfirmsPassword confirmed={disableTwoFactorAuthentication}>
                            {#if !confirming}
                                <DangerButton disabled={disabling}>Disable</DangerButton>
                            {/if}
                        </ConfirmsPassword>
                    </div>
                {/if}
            </div>
        </div>
    {/snippet}
</ActionSection>
