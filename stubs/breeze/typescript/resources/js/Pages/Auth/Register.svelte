<script lang="ts">
    import { inertia, useForm } from '@inertiajs/svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';
    import GuestLayout from '@/Layouts/GuestLayout.svelte';

    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = () => {
        $form.post('/register', {
            onFinish: () => {
                $form.reset('password', 'password_confirmation');
            },
        });
    };
</script>

<GuestLayout>
    <Helmet title="Register" />

    <form on:submit|preventDefault={submit}>
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

        <div class="mt-4">
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

        <div class="mt-4">
            <InputLabel forElement="password" value="Password" />

            <TextInput
                id="password"
                type="password"
                bind:value={$form.password}
                error={$form.errors.password}
                classes="mt-1 block w-full"
                required
                autocomplete="new-password"
            />

            <InputError classes="mt-2" message={$form.errors.password} />
        </div>

        <div class="mt-4">
            <InputLabel forElement="password_confirmation" value="Confirm Password" />

            <TextInput
                id="password_confirmation"
                type="password"
                bind:value={$form.password_confirmation}
                error={$form.errors.password_confirmation}
                classes="mt-1 block w-full"
                required
                autocomplete="new-password"
            />

            <InputError classes="mt-2" message={$form.errors.password_confirmation} />
        </div>

        <div class="mt-4 flex items-center justify-end">
            <a
                href="/login"
                use:inertia
                class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
            >
                Already registered?
            </a>

            <PrimaryButton classes="ms-4" disabled={$form.processing}>Register</PrimaryButton>
        </div>
    </form>
</GuestLayout>
