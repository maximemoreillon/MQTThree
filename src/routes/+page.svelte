<script lang="ts">
	import { onMount } from 'svelte';
	import ThreejsApp from '../ThreejsApp';

	let threejsApp: ThreejsApp;

	onMount(() => {
		threejsApp = new ThreejsApp();
	});

	const toggleLight = () => {
		threejsApp.ambientLight.intensity = Math.random();
	};
</script>

<div class="controls">
	<button on:click={() => toggleLight()}>Toggle light</button>
	{#if threejsApp}
		<p>intensity: {threejsApp.ambientLight.intensity}</p>
	{/if}
</div>

<style>
	.controls {
		position: absolute;
		top: 2em;
		right: 2em;
		padding: 1em;
	}
</style>
