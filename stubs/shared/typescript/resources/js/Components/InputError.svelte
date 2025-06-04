<script lang="ts">
    interface Props {
        message: string;
        classes?: string;
    }

    let { message, classes = '' }: Props = $props();
</script>

<div class:hidden={!message}>
    <p class="text-sm text-red-600 dark:text-red-400 {classes}">
        {message}
    </p>
</div>
