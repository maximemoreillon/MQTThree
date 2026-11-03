<script lang="ts">
	import { enhance } from '$app/forms';
	import FileUploadForm from '#lib/components/FileUploadForm.svelte';
	import { clearCredentials } from '#lib/credentials.ts';
	import { disconnect } from '#lib/mqtt.svelte.ts';

	function logout() {
		clearCredentials();
		disconnect();
	}
</script>

<div class="config_wrapper">
	<h3>Model</h3>
	<FileUploadForm endpoint="/api/model" field="model" accept=".glb" />
	<h3>Config</h3>
	<FileUploadForm endpoint="/api/devices" field="devices" accept=".yaml,.yml" />
	<a href="/">Home</a>
	<form method="post" action="/logout" use:enhance={logout}>
		<button type="submit" class="button">
			<span class="material-icons">logout</span>
			Logout
		</button>
	</form>
</div>

<style>
	.config_wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 1em;
		margin: 2em;
	}
</style>
