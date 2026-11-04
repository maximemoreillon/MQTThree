<script lang="ts">
	import { enhance } from '$app/forms';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import FileUploadForm from '#lib/components/FileUploadForm.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import * as Card from '#lib/components/ui/card/index.ts';
	import { clearCredentials } from '#lib/credentials.ts';
	import { disconnect } from '#lib/mqtt.svelte.ts';

	function logout() {
		clearCredentials();
		disconnect();
	}
</script>

<div class="mx-auto flex max-w-xl flex-col gap-4 p-4">
	<div class="flex items-center justify-between">
		<Button href="/" variant="ghost">
			<ArrowLeftIcon />
			Back
		</Button>
		<form method="post" action="/logout" use:enhance={logout}>
			<Button type="submit" variant="outline">
				<LogOutIcon />
				Log out
			</Button>
		</form>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>3D model</Card.Title>
			<Card.Description>The floor plan, as a .glb file</Card.Description>
		</Card.Header>
		<Card.Content>
			<FileUploadForm endpoint="/api/model" field="model" accept=".glb" />
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Devices</Card.Title>
			<Card.Description>devices.yml, checked before it replaces the current one</Card.Description>
		</Card.Header>
		<Card.Content>
			<FileUploadForm endpoint="/api/devices" field="devices" accept=".yaml,.yml" />
		</Card.Content>
	</Card.Root>
</div>
