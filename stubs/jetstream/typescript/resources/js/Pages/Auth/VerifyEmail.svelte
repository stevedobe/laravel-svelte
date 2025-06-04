<script lang="ts">
    import { inertia, useForm } from '@inertiajs/svelte';
    import AuthenticationCard from '@/Components/AuthenticationCard.svelte';
    import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';

    interface Props {
        status: string;
    }

    let { status }: Props = $props();

    const form = useForm({});

    const submit = (event: Event) => {
        event.preventDefault();

        $form.post('/email/verification-notification');
    };

    let verificationLinkSent = $derived(status === 'verification-link-sent');
</script>

<Helmet title="Email Verification" />

<AuthenticationCard>
    {#snippet authenticationCardLogo()}
        <div class="contents">
            <AuthenticationCardLogo />
        </div>
    {/snippet}

    <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Before continuing, could you verify your email address by clicking on the link we just
        emailed to you? If you didn't receive the email, we will gladly send you another.
    </div>

    {#if verificationLinkSent}
        <div class="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
            A new verification link has been sent to the email address you provided in your profile
            settings.
        </div>
    {/if}

    <form onsubmit={submit}>
        <div class="mt-4 flex items-center justify-between">
            <PrimaryButton disabled={$form.processing}>Resend Verification Email</PrimaryButton>

            <div>
                <a
                    href="/user/profile"
                    use:inertia
                    class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                >
                    Edit Profile
                </a>

                <button
                    use:inertia={{ href: '/logout', method: 'post' }}
                    type="button"
                    class="ms-2 rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                >
                    Log Out
                </button>
            </div>
        </div>
    </form>
</AuthenticationCard>
