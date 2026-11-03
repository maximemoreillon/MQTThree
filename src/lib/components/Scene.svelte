<script lang="ts">
	import { T } from '@threlte/core';
	import { ContactShadows, Grid, GLTF, OrbitControls, interactivity } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { deviceKey, type Device } from '#lib/devices.ts';
	import Light from './devices/Light.svelte';
	import Fan from './devices/Fan.svelte';
	import Sensor from './devices/Sensor.svelte';
	import Lock from './devices/Lock.svelte';

	let {
		onModelLoad,
		onModelError,
		onDevicesError
	}: {
		onModelLoad?: () => void;
		onModelError?: () => void;
		onDevicesError?: (message: string) => void;
	} = $props();

	const modelPath = '/api/model';

	interactivity();

	let devices = $state<Device[]>([]);

	onMount(async () => {
		try {
			const response = await fetch('/api/devices');
			if (!response.ok) {
				const body = await response.json().catch(() => undefined);
				throw new Error(body?.message ?? `Failed to load the devices (${response.status})`);
			}
			devices = await response.json();
		} catch (error) {
			console.error(error);
			onDevicesError?.((error as Error).message);
		}
	});
</script>

<T.PerspectiveCamera
	makeDefault
	fov={50}
	oncreate={(ref) => {
		ref.position.set(-10, 10, 10);
		ref.lookAt(0, 0, 0);
	}}
>
	<OrbitControls />
</T.PerspectiveCamera>

<!-- Physically based lighting (three r155+): intensity scaled by π vs. the old legacy value 0.2 -->
<T.AmbientLight intensity={0.2 * Math.PI} />

<Grid
	position.y={0}
	cellColor="#ffffff"
	sectionColor="#c00000"
	sectionThickness={2}
	fadeDistance={25}
	cellSize={2}
/>

<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />

{#each devices as device (deviceKey(device))}
	{#if device.type === 'light'}
		<Light {device} />
	{:else if device.type === 'fan'}
		<Fan {device} />
	{:else if device.type === 'sensor'}
		<Sensor {device} />
	{:else if device.type === 'lock'}
		<Lock {device} />
	{/if}
{/each}

<GLTF url={modelPath} castShadow receiveShadow onload={onModelLoad} onerror={onModelError} />
