<script lang="ts">
    import Modal from './Modal.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        show?: boolean;
        maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
        closeable?: boolean;
        dialogModalTitle?: Snippet;
        dialogModalContent?: Snippet;
        dialogModalFooter?: Snippet;
        closed?: () => void;
    }

    let {
        show = false,
        maxWidth = '2xl',
        closeable = true,
        dialogModalTitle,
        dialogModalContent,
        dialogModalFooter,
        closed = () => {
            // Do nothing by default
        },
    }: Props = $props();
</script>

<Modal {show} {maxWidth} {closeable} closed={() => closed?.()}>
    <div class="px-6 py-4">
        <div class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {@render dialogModalTitle?.()}
        </div>

        <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {@render dialogModalContent?.()}
        </div>
    </div>

    <div class="flex flex-row justify-end bg-gray-100 px-6 py-4 text-end dark:bg-gray-800">
        {@render dialogModalFooter?.()}
    </div>
</Modal>
