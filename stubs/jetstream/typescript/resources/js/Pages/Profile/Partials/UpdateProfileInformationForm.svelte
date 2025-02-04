<script lang="ts">
    import { inertia, page, router, useForm } from '@inertiajs/svelte';
    import ActionMessage from '@/Components/ActionMessage.svelte';
    import FormSection from '@/Components/FormSection.svelte';
    import InputError from '@/Components/InputError.svelte';
    import InputLabel from '@/Components/InputLabel.svelte';
    import PrimaryButton from '@/Components/PrimaryButton.svelte';
    import SecondaryButton from '@/Components/SecondaryButton.svelte';
    import TextInput from '@/Components/TextInput.svelte';
    import type { User } from '@/Types';

    export let user: User;

    const form = useForm({
        _method: 'PUT',
        name: user.name,
        email: user.email,
        photo: null,
    });

    let verificationLinkSent: boolean | null = null;
    let photoPreview: string | ArrayBuffer | null = null;
    let photoInput: HTMLInputElement;

    const updateProfileInformation = () => {
        if (photoInput?.files) {
            $form.photo = photoInput.files[0];
        }

        $form.post('/user/profile-information', {
            errorBag: 'updateProfileInformation',
            preserveScroll: true,
            onSuccess: () => {
                clearPhotoFileInput();
            },
        });
    };

    const sendEmailVerification = () => {
        verificationLinkSent = true;
    };

    const selectNewPhoto = () => {
        photoInput.click();
    };

    const updatePhotoPreview = () => {
        if (!photoInput.files) {
            return;
        }

        const photo = photoInput.files[0];

        if (!photo) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            if (e.target?.result) {
                photoPreview = e.target.result;
            }
        };

        reader.readAsDataURL(photo);
    };

    const deletePhoto = () => {
        router.delete('/user/profile-photo', {
            preserveScroll: true,
            onSuccess: () => {
                photoPreview = null;
                clearPhotoFileInput();
            },
        });
    };

    const clearPhotoFileInput = () => {
        if (photoInput.value) {
            photoInput.value = '';
        }
    };
</script>

<FormSection on:submitted={updateProfileInformation}>
    <div slot="title" class="contents">Profile Information</div>

    <div slot="description" class="contents">
        Update your account's profile information and email address.
    </div>

    <div slot="form" class="contents">
        <!-- Profile Photo -->
        {#if $page.props.jetstream.managesProfilePhotos}
            <div class="col-span-6 sm:col-span-4">
                <!-- Profile Photo File Input -->
                <input
                    id="photo"
                    type="file"
                    bind:this={photoInput}
                    class="hidden"
                    on:change={updatePhotoPreview}
                />

                <InputLabel forElement="photo" value="Photo" />

                <!-- Current Profile Photo -->
                <div class="mt-2" class:hidden={!!photoPreview}>
                    <img
                        src={user.profile_photo_url}
                        alt={user.name}
                        class="size-20 rounded-full object-cover"
                    />
                </div>

                <!-- New Profile Photo Preview -->
                <div class="mt-2" class:hidden={!photoPreview}>
                    <span
                        class="block size-20 rounded-full bg-cover bg-center bg-no-repeat"
                        style={`background-image: url('${String(photoPreview)}');`}
                    />
                </div>

                <SecondaryButton on:clicked={selectNewPhoto} classes="me-2 mt-2">
                    Select A New Photo
                </SecondaryButton>

                {#if user.profile_photo_path}
                    <SecondaryButton on:clicked={deletePhoto} classes="mt-2">
                        Remove Photo
                    </SecondaryButton>
                {/if}

                <InputError message={$form.errors.photo} classes="mt-2" />
            </div>
        {/if}

        <!-- Name -->
        <div class="col-span-6 sm:col-span-4">
            <InputLabel forElement="name" value="Name" />
            <TextInput
                id="name"
                bind:value={$form.name}
                error={$form.errors.name}
                classes="mt-1 block w-full"
                required
                autocomplete="name"
            />
            <InputError message={$form.errors.name} classes="mt-2" />
        </div>

        <!-- Email -->
        <div class="col-span-6 sm:col-span-4">
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
            <InputError message={$form.errors.email} classes="mt-2" />

            {#if $page.props.jetstream.hasEmailVerification && user.email_verified_at === null}
                <div>
                    <p class="mt-2 text-sm dark:text-white">
                        Your email address is unverified.

                        <button
                            type="button"
                            use:inertia={{
                                href: '/email/verification-notification',
                                method: 'post',
                            }}
                            class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            on:click|preventDefault={sendEmailVerification}
                        >
                            Click here to re-send the verification email.
                        </button>
                    </p>

                    <div
                        class="mt-2 text-sm font-medium text-green-600 dark:text-green-400"
                        class:hidden={!verificationLinkSent}
                    >
                        A new verification link has been sent to your email address.
                    </div>
                </div>
            {/if}
        </div>
    </div>

    <div slot="actions" class="contents">
        <ActionMessage on={$form.recentlySuccessful} classes="me-3">Saved.</ActionMessage>

        <PrimaryButton disabled={$form.processing} dataTestId="profile-information-button">
            Save
        </PrimaryButton>
    </div>
</FormSection>
