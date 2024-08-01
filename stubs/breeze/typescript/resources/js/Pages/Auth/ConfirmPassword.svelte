<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import GuestLayout from '@/Layouts/GuestLayout.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    const form = useForm({
        password: '',
    });

    const submit = () => {
        $form.post('/confirm-password', {
            onFinish: () => {
                $form.reset();
            },
        });
    };
</script>

<GuestLayout>
    <Helmet title="Confirm Password" />

    <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        This is a secure area of the application. Please confirm your password before continuing.
    </div>

    <form on:submit|preventDefault={submit}>
        <div>
            <InputLabel forElement="password" value="Password" />
            <TextInput
                id="password"
                type="password"
                bind:value={$form.password}
                error={$form.errors.password}
                classes="mt-1 block w-full"
                required
                autocomplete="current-password"
                autofocus
            />
            <InputError classes="mt-2" message={$form.errors.password} />
        </div>

        <div class="mt-4 flex justify-end">
            <PrimaryButton classes="ms-4" disabled={$form.processing}>Confirm</PrimaryButton>
        </div>
    </form>
</GuestLayout>
