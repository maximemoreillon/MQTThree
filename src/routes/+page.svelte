<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '#lib/components/Scene.svelte';
	import LoadingOverlay from '#lib/components/LoadingOverlay.svelte';
	import { mqttState } from '#lib/mqtt.svelte.ts';

	let modelLoaded = $state(false);
	let errors = $state<string[]>([]);

	// Keep the scene once it has been shown, so a dropped connection doesn't reload the model
	let hasConnected = $state(false);
	$effect(() => {
		if (mqttState.connected) hasConnected = true;
	});

	const addError = (message: string) => (errors = [...errors, message]);
</script>

{#if hasConnected}
	<div class="threejs_wrapper">
		<Canvas>
			<Scene
				onModelLoad={() => (modelLoaded = true)}
				onModelError={() => {
					modelLoaded = true;
					addError('Failed to load the 3D model');
				}}
				onDevicesError={addError}
			/>
		</Canvas>
	</div>
{/if}

{#if !mqttState.connected}
	<LoadingOverlay message={hasConnected ? 'Reconnecting to MQTT...' : 'Connecting to MQTT...'} />
{:else if !modelLoaded}
	<LoadingOverlay message="Loading model..." />
{/if}

{#if errors.length}
	<ul class="errors" role="alert">
		{#each errors as error, index (index)}
			<li>{error}</li>
		{/each}
	</ul>
{/if}

<a href="/config" class="settings_button" aria-label="Settings">
	<span class="material-icons">settings</span>
</a>

<style>
	.settings_button {
		position: fixed;
		top: 2em;
		left: 2em;
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--primary);
		color: #fff;
		text-decoration: none;
		box-shadow: 0 3px 6px rgb(0 0 0 / 0.3);
	}

	.errors {
		position: fixed;
		bottom: 2em;
		left: 50%;
		transform: translateX(-50%);
		margin: 0;
		padding: 0.75em 1.25em;
		list-style: none;
		border-radius: 4px;
		background: var(--error);
		color: #fff;
		white-space: pre-line;
	}

	.threejs_wrapper {
		width: 100vw;
		height: 100vh;
		background: linear-gradient(180deg, rgb(13 19 32) 0%, rgb(8 12 21) 100%);
	}
</style>
