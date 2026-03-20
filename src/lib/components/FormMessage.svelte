<script lang="ts">
	let { message }: { message?: { type: string; text: string } | null } = $props();
</script>

{#if message?.type === 'error'}
	<p class="mb-6 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{message.text}</p>
{/if}
