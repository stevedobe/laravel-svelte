<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';
    import GuestLayout from '@/Layouts/GuestLayout.svelte';

    export let email: string;
    export let token: string;

    const form = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = () => {
        $form.post('/reset-password', {
            onFinish: () => {
                $form.reset('password', 'password_confirmation');
            },
        });
    };
</script>

<GuestLayout>
    <Helmet title="Reset Password" />

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
            <PrimaryButton disabled={$form.processing}>Reset Password</PrimaryButton>
        </div>
    </form>
</GuestLayout>
