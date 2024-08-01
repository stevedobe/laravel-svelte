<script lang="ts">
    import { inertia, useForm } from '@inertiajs/svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import GuestLayout from '@/Layouts/GuestLayout.svelte';

    export let status: string;

    const form = useForm({});

    $: verificationLinkSent = status === 'verification-link-sent';

    const submit = () => {
        $form.post('/email/verification-notification');
    };
</script>

<GuestLayout>
    <Helmet title="Email Verification" />

    <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Thanks for signing up! Before getting started, could you verify your email address by
        clicking on the link we just emailed to you? If you didn't receive the email, we will gladly
        send you another.
    </div>

    {#if verificationLinkSent}
        <div class="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
            A new verification link has been sent to the email address you provided during
            registration.
        </div>
    {/if}

    <form on:submit|preventDefault={submit}>
        <div class="mt-4 flex items-center justify-between">
            <PrimaryButton disabled={$form.processing}>Resend Verification Email</PrimaryButton>

            <button
                use:inertia={{ href: '/logout', method: 'post' }}
                type="button"
                class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
            >
                Log Out
            </button>
        </div>
    </form>
</GuestLayout>
