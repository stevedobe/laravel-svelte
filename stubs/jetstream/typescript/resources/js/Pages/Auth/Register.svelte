<script labg="ts">
    import { inertia, page, useForm } from '@inertiajs/svelte';
    import AuthenticationCard from '@/Components/AuthenticationCard.svelte';
    import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte';
    import Checkbox from '@/Components/Checkbox.svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';

    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit = () => {
        $form.post('/register', {
            onFinish: () => $form.reset('password', 'password_confirmation'),
        });
    };
</script>

<Helmet title="Register" />

<AuthenticationCard>
    <div slot="logo" class="contents">
        <AuthenticationCardLogo />
    </div>

    <form on:submit|preventDefault={submit}>
        <div>
            <InputLabel forElement="name" value="Name" />
            <TextInput
                id="name"
                bind:value={$form.name}
                type="text"
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
                bind:value={$form.email}
                type="email"
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
                bind:value={$form.password}
                type="password"
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
                bind:value={$form.password_confirmation}
                type="password"
                classes="mt-1 block w-full"
                required
                autocomplete="new-password"
            />
            <InputError classes="mt-2" message={$form.errors.password_confirmation} />
        </div>

        {#if $page.props.jetstream.hasTermsAndPrivacyPolicyFeature}
            <div class="mt-4">
                <InputLabel forElement="terms">
                    <div class="flex items-center">
                        <Checkbox id="terms" bind:checked={$form.terms} required />

                        <div class="ms-2">
                            I agree to the
                            <a
                                target="_blank"
                                href="/terms-of-service"
                                use:inertia
                                class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Terms of Service
                            </a>
                            and
                            <a
                                target="_blank"
                                href="/privacy-policy"
                                use:inertia
                                class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                    <InputError classes="mt-2" message={$form.errors.terms} />
                </InputLabel>
            </div>
        {/if}

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
</AuthenticationCard>
