<script lang="ts">
    import { fade } from 'svelte/transition';
    import { inertia, page, useForm } from '@inertiajs/svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    export let mustVerifyEmail: boolean;
    export let status: string;
    export let classes = '';

    let { user } = $page.props.auth;
    $: user = $page.props.auth.user;

    const form = useForm({
        name: user.name,
        email: user.email,
    });
</script>

<section class={classes}>
    <header>
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>

        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update your account's profile information and email address.
        </p>
    </header>

    <form
        on:submit|preventDefault={() => {
            $form.patch('/profile');
        }}
        class="mt-6 space-y-6"
    >
        <div>
            <InputLabel forElement="name" value="Name" />

            <TextInput
                id="name"
                type="text"
                bind:value={$form.name}
                error={$form.errors.name}
                classes="mt-1 block w-full"
                required
                autofocus
                autocomplete="name"
            />

            <InputError classes="mt-2" message={$form.errors.name} />
        </div>

        <div>
            <InputLabel forElement="email" value="Email" />

            <TextInput
                id="email"
                type="email"
                bind:value={$form.email}
                error={$form.errors.email}
                classes="mt-1 block w-full"
                required
                autocomplete="username"
            />

            <InputError classes="mt-2" message={$form.errors.email} />
        </div>

        {#if mustVerifyEmail && user.email_verified_at === null}
            <div>
                <p class="mt-2 text-sm text-gray-800 dark:text-gray-200">
                    Your email address is unverified.
                    <button
                        type="button"
                        use:inertia={{
                            href: '/email/verification-notification',
                            method: 'post',
                        }}
                        class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    >
                        Click here to re-send the verification email.
                    </button>
                </p>

                <div
                    class="mt-2 text-sm font-medium text-green-600 dark:text-green-400"
                    class:hidden={status !== 'verification-link-sent'}
                >
                    A new verification link has been sent to your email address.
                </div>
            </div>
        {/if}

        <div class="flex items-center gap-4">
            <PrimaryButton disabled={$form.processing} dataTestId="profile-information-button">
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
