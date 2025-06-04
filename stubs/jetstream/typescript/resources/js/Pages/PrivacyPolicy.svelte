<script lang="ts">
    import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo.svelte';
    import Helmet from '@/Components/Helmet.svelte';

    /* eslint svelte/no-at-html-tags: "off" */

    interface Props {
        policy: string;
    }

    let { policy }: Props = $props();
</script>

<Helmet title="Privacy Policy" />

<div class="font-sans text-gray-900 antialiased dark:text-gray-100">
    <div class="bg-gray-100 pt-4 dark:bg-gray-900">
        <div class="flex min-h-screen flex-col items-center pt-6 sm:pt-0">
            <div>
                <AuthenticationCardLogo />
            </div>

            <div
                class="prose dark:prose-invert mt-6 w-full overflow-hidden bg-white p-6 shadow-md sm:max-w-2xl sm:rounded-lg dark:bg-gray-800"
            >
                {@html policy}
            </div>
        </div>
    </div>
</div>
