<script lang="ts">
	let { endpoint, field, accept }: { endpoint: string; field: string; accept: string } = $props();

	let files = $state<FileList | undefined>();
	let status = $state<string | undefined>();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const file = files?.[0];
		if (!file) return;

		const body = new FormData();
		body.append(field, file);

		status = 'Uploading...';
		const response = await fetch(endpoint, { method: 'POST', body });
		status = response.ok ? 'Upload OK' : `Upload failed (${response.status})`;
	}
</script>

<form onsubmit={handleSubmit}>
	<input type="file" {accept} bind:files />
	<button type="submit" class="button" disabled={!files?.length}>
		<span class="material-icons">upload</span>
		Upload
	</button>
	{#if status}<span>{status}</span>{/if}
</form>

<style>
	form {
		display: flex;
		align-items: center;
		gap: 1em;
		flex-wrap: wrap;
	}
</style>
