<script lang="ts">
    import { inertia, useForm } from '@inertiajs/svelte';
    import Checkbox from '@/Components/Checkbox.svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import GuestLayout from '@/Layouts/GuestLayout.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    interface Props {
        canResetPassword: boolean;
        status: string;
    }

    let { canResetPassword, status }: Props = $props();

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event: Event) => {
        event.preventDefault();

        $form.post('/login', {
            onFinish: () => {
                $form.reset('password');
            },
        });
    };
</script>

<GuestLayout>
    <Helmet title="Log in" />

    {#if status}
        <div class="mb-4 text-sm font-medium text-green-600">
            {status}
        </div>
    {/if}

    <form onsubmit={submit}>
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
                autocomplete="current-password"
            />

            <InputError classes="mt-2" message={$form.errors.password} />
        </div>

        <div class="mt-4 block">
            <label for="remember" class="flex items-center">
                <Checkbox id="remember" bind:checked={$form.remember} />
                <span class="ms-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
        </div>

        <div class="mt-4 flex items-center justify-end">
            {#if canResetPassword}
                <a
                    href="/forgot-password"
                    use:inertia
                    class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                >
                    Forgot your password?
                </a>
            {/if}

            <PrimaryButton classes="ms-4" disabled={$form.processing}>Log in</PrimaryButton>
        </div>
    </form>
</GuestLayout>
