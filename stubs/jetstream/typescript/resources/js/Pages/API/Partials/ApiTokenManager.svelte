<script lang="ts">
    import { page, useForm } from '@inertiajs/svelte';
    import ActionMessage from '@/Components/ActionMessage.svelte';
    import ActionSection from '@/Components/ActionSection.svelte';
    import CheckboxGroup from '@/Components/CheckboxGroup.svelte';
    import ConfirmationModal from '@/Components/ConfirmationModal.svelte';
    import DangerButton from '@/Components/DangerButton.svelte';
    import DialogModal from '@/Components/DialogModal.svelte';
    import FormSection from '@/Components/FormSection.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import SecondaryButton from '@/Components/SecondaryButton.svelte';
    import SectionBorder from '@/Components/SectionBorder.svelte';
    import TextInput from '@/Components/TextInput.svelte';
    import type { Token } from './../Token';

    interface Props {
        tokens: Token[];
        availablePermissions: string[];
        defaultPermissions: string[];
    }

    let { tokens, availablePermissions, defaultPermissions }: Props = $props();

    const createApiTokenForm = useForm({
        name: '',
        permissions: defaultPermissions,
    });

    const updateApiTokenForm = useForm({
        permissions: [],
    });

    const deleteApiTokenForm = useForm({});

    let displayingToken = $state(false);
    let managingPermissionsFor: Token | null = $state(null);
    let apiTokenBeingDeleted: Token | null = $state(null);

    const createApiToken = () => {
        $createApiTokenForm.post('/user/api-tokens', {
            preserveScroll: true,
            onSuccess: () => {
                displayingToken = true;
                $createApiTokenForm.reset();
            },
        });
    };

    const manageApiTokenPermissions = (token: Token) => {
        $updateApiTokenForm.permissions = token.abilities;
        managingPermissionsFor = token;
    };

    const updateApiToken = () => {
        if (managingPermissionsFor) {
            $updateApiTokenForm.put(`/user/api-tokens/${managingPermissionsFor.id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => (managingPermissionsFor = null),
            });
        }
    };

    const confirmApiTokenDeletion = (token: Token) => {
        apiTokenBeingDeleted = token;
    };

    const deleteApiToken = () => {
        if (apiTokenBeingDeleted) {
            $deleteApiTokenForm.delete(`/user/api-tokens/${apiTokenBeingDeleted.id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => (apiTokenBeingDeleted = null),
            });
        }
    };
</script>

<div>
    <!-- Generate API Token -->
    <FormSection submitted={createApiToken}>
        {#snippet formSectionTitle()}
            <div class="contents">Create API Token</div>
        {/snippet}

        {#snippet formSectionDescription()}
            <div class="contents">
                API tokens allow third-party services to authenticate with our application on your
                behalf.
            </div>
        {/snippet}

        {#snippet formSectionForm()}
            <div class="contents">
                <!-- Token Name -->
                <div class="col-span-6 sm:col-span-4">
                    <InputLabel forElement="name" value="Name" />
                    <TextInput
                        id="name"
                        bind:value={$createApiTokenForm.name}
                        error={$createApiTokenForm.errors.name}
                        classes="mt-1 block w-full"
                        autofocus
                    />
                    <InputError message={$createApiTokenForm.errors.name} classes="mt-2" />
                </div>

                <!-- Token Permissions -->
                {#if availablePermissions.length > 0}
                    <div class="col-span-6">
                        <InputLabel forElement="permissions" value="Permissions" />

                        <div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CheckboxGroup
                                checkboxes={availablePermissions}
                                bind:group={$createApiTokenForm.permissions}
                            />
                        </div>
                    </div>
                {/if}
            </div>
        {/snippet}

        {#snippet formSectionActions()}
            <div class="contents">
                <ActionMessage on={$createApiTokenForm.recentlySuccessful} classes="me-3">
                    Created.
                </ActionMessage>

                <PrimaryButton disabled={$createApiTokenForm.processing} dataTestId="create-button">
                    Create
                </PrimaryButton>
            </div>
        {/snippet}
    </FormSection>

    {#if tokens.length > 0}
        <div>
            <SectionBorder />

            <!-- Manage API Tokens -->
            <div class="mt-10 sm:mt-0">
                <ActionSection>
                    {#snippet actionSectionTitle()}
                        <div class="contents">Manage API Tokens</div>
                    {/snippet}

                    {#snippet actionSectionDescription()}
                        <div class="contents">
                            You may delete any of your existing tokens if they are no longer needed.
                        </div>
                    {/snippet}

                    <!-- API Token List -->
                    {#snippet actionSectionContent()}
                        <div class="contents">
                            <div class="space-y-6" data-testid="api-tokens">
                                {#each tokens as token}
                                    <div class="flex items-center justify-between">
                                        <div class="break-all dark:text-white">
                                            {token.name}
                                        </div>

                                        <div class="ms-2 flex items-center">
                                            {#if token.last_used_ago}
                                                <div class="text-sm text-gray-400">
                                                    Last used {token.last_used_ago}
                                                </div>
                                            {/if}

                                            {#if availablePermissions.length > 0}
                                                <button
                                                    class="ms-6 cursor-pointer text-sm text-gray-400 underline"
                                                    onclick={() => {
                                                        manageApiTokenPermissions(token);
                                                    }}
                                                    data-testid="permissions-button"
                                                >
                                                    Permissions
                                                </button>
                                            {/if}

                                            <button
                                                class="ms-6 cursor-pointer text-sm text-red-500"
                                                onclick={() => {
                                                    confirmApiTokenDeletion(token);
                                                }}
                                                data-testid="delete-button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/snippet}
                </ActionSection>
            </div>
        </div>
    {/if}

    <!-- Token Value Modal -->
    <DialogModal show={displayingToken} closed={() => (displayingToken = false)}>
        {#snippet dialogModalTitle()}
            <div class="contents">API Token</div>
        {/snippet}

        {#snippet dialogModalContent()}
            <div class="contents">
                <div>
                    Please copy your new API token. For your security, it won't be shown again.
                </div>

                {#if $page.props.jetstream.flash.token}
                    <div
                        class="mt-4 rounded-sm bg-gray-100 px-4 py-2 font-mono text-sm break-all text-gray-500 dark:bg-gray-900"
                    >
                        {$page.props.jetstream.flash.token}
                    </div>
                {/if}
            </div>
        {/snippet}

        {#snippet dialogModalFooter()}
            <div class="contents">
                <SecondaryButton
                    clicked={() => (displayingToken = false)}
                    dataTestId="close-api-token"
                >
                    Close
                </SecondaryButton>
            </div>
        {/snippet}
    </DialogModal>

    <!-- API Token Permissions Modal -->
    <DialogModal
        show={managingPermissionsFor !== null}
        closed={() => (managingPermissionsFor = null)}
    >
        {#snippet dialogModalTitle()}
            <div class="contents">API Token Permissions</div>
        {/snippet}

        {#snippet dialogModalContent()}
            <div class="contents">
                <div
                    class="grid grid-cols-1 gap-4 md:grid-cols-2"
                    data-testid="api-token-permissions-modal"
                >
                    <CheckboxGroup
                        checkboxes={availablePermissions}
                        bind:group={$updateApiTokenForm.permissions}
                    />
                </div>
            </div>
        {/snippet}

        {#snippet dialogModalFooter()}
            <div class="contents">
                <SecondaryButton
                    clicked={() => (managingPermissionsFor = null)}
                    dataTestId="cancel-permissions"
                >
                    Cancel
                </SecondaryButton>

                <PrimaryButton
                    type="button"
                    classes="ms-3"
                    disabled={$updateApiTokenForm.processing}
                    clicked={updateApiToken}
                    dataTestId="save-permissions"
                >
                    Save
                </PrimaryButton>
            </div>
        {/snippet}
    </DialogModal>

    <!-- Delete Token Confirmation Modal -->
    <ConfirmationModal
        show={apiTokenBeingDeleted !== null}
        closed={() => (apiTokenBeingDeleted = null)}
    >
        {#snippet confirmationModalTitle()}
            <div class="contents">Delete API Token</div>
        {/snippet}

        {#snippet confirmationModalContent()}
            <div class="contents">Are you sure you would like to delete this API token?</div>
        {/snippet}

        {#snippet confirmationModalFooter()}
            <div class="contents">
                <SecondaryButton clicked={() => (apiTokenBeingDeleted = null)}>
                    Cancel
                </SecondaryButton>

                <DangerButton
                    classes="ms-3"
                    disabled={$deleteApiTokenForm.processing}
                    clicked={deleteApiToken}
                    dataTestId="delete-confirm-button"
                >
                    Delete
                </DangerButton>
            </div>
        {/snippet}
    </ConfirmationModal>
</div>
