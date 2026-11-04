<script lang="ts">
	import UploadIcon from '@lucide/svelte/icons/upload';
	import * as Alert from '#lib/components/ui/alert/index.ts';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { Input } from '#lib/components/ui/input/index.ts';
	import { Spinner } from '#lib/components/ui/spinner/index.ts';

	let { endpoint, field, accept }: { endpoint: string; field: string; accept: string } = $props();

	let files = $state<FileList | undefined>();
	let uploading = $state(false);
	let result = $state<{ ok: boolean; message: string } | undefined>();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const file = files?.[0];
		if (!file) return;

		const body = new FormData();
		body.append(field, file);

		uploading = true;
		result = undefined;
		try {
			const response = await fetch(endpoint, { method: 'POST', body });
			if (response.ok) result = { ok: true, message: 'Uploaded' };
			else {
				const data = await response.json().catch(() => undefined);
				result = { ok: false, message: data?.message ?? `Error ${response.status}` };
			}
		} catch {
			result = { ok: false, message: 'Server unreachable' };
		} finally {
			uploading = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-3">
	<div class="flex gap-2">
		<Input type="file" {accept} bind:files onchange={() => (result = undefined)} />
		<Button type="submit" disabled={!files?.length || uploading}>
			{#if uploading}<Spinner />{:else}<UploadIcon />{/if}
			Upload
		</Button>
	</div>
	{#if result}
		<Alert.Root variant={result.ok ? 'default' : 'destructive'}>
			<Alert.Title>{result.ok ? 'Uploaded' : 'Upload failed'}</Alert.Title>
			{#if !result.ok}
				<Alert.Description class="whitespace-pre-line">{result.message}</Alert.Description>
			{/if}
		</Alert.Root>
	{/if}
</form>
