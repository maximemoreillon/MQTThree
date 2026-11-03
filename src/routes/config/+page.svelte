<!-- PROBLEM: This page can be accessed without being authenticated -->
<script lang="ts">
	import FileUploadForm from '#lib/components/FileUploadForm.svelte';
</script>

<div class="config_wrapper">
	<h3>Model</h3>
	<FileUploadForm endpoint="/api/model" field="model" accept=".glb" />
	<h3>Config</h3>
	<FileUploadForm endpoint="/api/devices" field="devices" accept=".yaml,.yml" />
	<a href="/">Home</a>
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
