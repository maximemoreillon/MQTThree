<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '#lib/components/Scene.svelte';
	import LoadingOverlay from '#lib/components/LoadingOverlay.svelte';
	import { mqttState } from '#lib/mqtt.svelte.ts';

	let modelLoaded = $state(false);
</script>

{#if mqttState.connected}
	<div class="threejs_wrapper">
		<Canvas>
			<Scene onModelLoad={() => (modelLoaded = true)} onModelError={() => (modelLoaded = true)} />
		</Canvas>
	</div>

	{#if !modelLoaded}
		<LoadingOverlay message="Loading model..." />
	{/if}
{:else}
	<LoadingOverlay message="Connecting to MQTT..." />
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

	.threejs_wrapper {
		width: 100vw;
		height: 100vh;
		background: linear-gradient(180deg, rgb(13 19 32) 0%, rgb(8 12 21) 100%);
	}
</style>
