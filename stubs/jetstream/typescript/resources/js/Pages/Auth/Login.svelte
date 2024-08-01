<script lang="ts">
    import { inertia, useForm } from '@inertiajs/svelte';
    import AuthenticationCard from '@/Components/AuthenticationCard.svelte';
    import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte';
    import Checkbox from '@/Components/Checkbox.svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    export let canResetPassword: boolean;
    export let status: string;

    type LoginForm = {
        email: string;
        password: string;
        remember: boolean;
    };

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = () => {
        $form
            .transform((data: LoginForm) => ({
                ...data,
                remember: $form.remember ? 'on' : '',
            }))
            .post('/login', {
                onFinish: () => $form.reset('password'),
            });
    };
</script>

<Helmet title="Log in" />

<AuthenticationCard>
    <div slot="logo" class="contents">
        <AuthenticationCardLogo />
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
                    class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                >
                    Forgot your password?
                </a>
            {/if}

            <PrimaryButton classes="ms-4" disabled={$form.processing}>Log in</PrimaryButton>
        </div>
    </form>
</AuthenticationCard>
