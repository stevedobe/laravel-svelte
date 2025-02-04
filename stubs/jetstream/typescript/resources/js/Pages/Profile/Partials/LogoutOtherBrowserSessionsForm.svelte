<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import ActionMessage from '@/Components/ActionMessage.svelte';
    import ActionSection from '@/Components/ActionSection.svelte';
    import DialogModal from '@/Components/DialogModal.svelte';
    import InputError from '@/Components/InputError.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import SecondaryButton from '@/Components/SecondaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';
    import type { Session } from '../Session';

    export let sessions: Session[];
    export let classes = '';

    let confirmingLogout = false;
    let passwordInput: TextInput;

    const form = useForm({
        password: '',
    });

    const confirmLogout = () => {
        confirmingLogout = true;

        setTimeout(() => passwordInput.focus(), 250);
    };

    const logoutOtherBrowserSessions = () => {
        $form.delete('/user/other-browser-sessions', {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onError: () => passwordInput.focus(),
            onFinish: () => $form.reset(),
        });
    };

    const closeModal = () => {
        confirmingLogout = false;

        $form.reset();
    };
</script>

<ActionSection {classes}>
    <div slot="title" class="contents">Browser Sessions</div>

    <div slot="description" class="contents">
        Manage and log out your active sessions on other browsers and devices.
    </div>

    <div slot="content" class="contents">
        <div class="max-w-xl text-sm text-gray-600 dark:text-gray-400">
            If necessary, you may log out of all of your other browser sessions across all of your
            devices. Some of your recent sessions are listed below; however, this list may not be
            exhaustive. If you feel your account has been compromised, you should also update your
            password.
        </div>

        <!-- Other Browser Sessions -->
        {#if sessions.length > 0}
            <div class="mt-5 space-y-6">
                {#each sessions as session}
                    <div class="flex items-center">
                        <div>
                            {#if session.agent.is_desktop}
                                <svg
                                    class="size-8 text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                                    />
                                </svg>
                            {:else}
                                <svg
                                    class="size-8 text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                                    />
                                </svg>
                            {/if}
                        </div>

                        <div class="ms-3">
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                {session.agent.platform ? session.agent.platform : 'Unknown'} -
                                {session.agent.browser ? session.agent.browser : 'Unknown'}
                            </div>

                            <div>
                                <div class="text-xs text-gray-500">
                                    {session.ip_address},

                                    {#if session.is_current_device}
                                        <span class="font-semibold text-green-500">
                                            This device
                                        </span>
                                    {:else}
                                        <span>Last active {session.last_active}</span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

        <div class="mt-5 flex items-center">
            <PrimaryButton
                type="button"
                on:clicked={confirmLogout}
                dataTestId="logout-other-browser-sessions-button"
            >
                Log Out Other Browser Sessions
            </PrimaryButton>

            <ActionMessage on={$form.recentlySuccessful} classes="ms-3">Done.</ActionMessage>
        </div>

        <!-- Log Out Other Devices Confirmation Modal -->
        <DialogModal show={confirmingLogout} on:closed={closeModal}>
            <div slot="title" class="contents">Log Out Other Browser Sessions</div>

            <div slot="content" class="contents">
                Please enter your password to confirm you would like to log out of your other
                browser sessions across all of your devices.

                <div class="mt-4">
                    <TextInput
                        type="password"
                        bind:this={passwordInput}
                        bind:value={$form.password}
                        error={$form.errors.password}
                        classes="mt-1 block w-3/4"
                        placeholder="Password"
                        autocomplete="current-password"
                        on:entered={logoutOtherBrowserSessions}
                        data-testid="logout-other-browser-sessions-form-password"
                    />

                    <InputError message={$form.errors.password} classes="mt-2" />
                </div>
            </div>

            <div slot="footer" class="contents">
                <SecondaryButton on:clicked={closeModal}>Cancel</SecondaryButton>

                <PrimaryButton
                    type="button"
                    classes="ms-3"
                    disabled={$form.processing}
                    on:clicked={logoutOtherBrowserSessions}
                >
                    Log Out Other Browser Sessions
                </PrimaryButton>
            </div>
        </DialogModal>
    </div>
</ActionSection>
