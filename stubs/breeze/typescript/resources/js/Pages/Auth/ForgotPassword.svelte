<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';
    import GuestLayout from '@/Layouts/GuestLayout.svelte';

    export let status: string;

    const form = useForm({
        email: '',
    });

    const submit = () => {
        $form.post('/forgot-password');
    };
</script>

<GuestLayout>
    <Helmet title="Forgot Password" />

    <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Forgot your password? No problem. Just let us know your email address and we will email you
        a password reset link that will allow you to choose a new one.
    </div>

    {#if status}
        <div class="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
            {status}
        </div>
    {/if}

    <form on:submit|preventDefault={submit}>
        <div>
            <InputLabel forElement="email" value="Email" />

            <TextInput
                id="email"
                type="email"
                bind:value={$form.email}
                error={$form.errors.email}
                classes="mt-1 block w-full"
                required
                autofocus
                autocomplete="username"
            />

            <InputError classes="mt-2" message={$form.errors.email} />
        </div>

        <div class="mt-4 flex items-center justify-end">
            <PrimaryButton disabled={$form.processing}>Email Password Reset Link</PrimaryButton>
        </div>
    </form>
</GuestLayout>
