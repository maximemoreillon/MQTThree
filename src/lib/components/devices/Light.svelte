<script lang="ts">
	import { T } from '@threlte/core';
	import { onMount } from 'svelte';
	import { publish, subscribe } from '#lib/mqtt.svelte.ts';
	import { getState, toArray, type LightDevice } from '#lib/devices.ts';
	import LightModel from './LightModel.svelte';

	let { device }: { device: LightDevice } = $props();

	const scale = 0.015;
	const payloadOn = $derived(device.payload?.on ?? 'on');
	const payloadOff = $derived(device.payload?.off ?? 'off');

	let deviceState = $state<string | undefined>();
	const isOn = $derived(deviceState?.toLowerCase() === payloadOn);
	const color = $derived(isOn ? '#ffff00' : '#ffffff');
	const opacity = $derived(isOn ? 0.5 : 0.25);

	function handleClick() {
		const targetState = isOn ? payloadOff : payloadOn;
		publish(device.commandTopic, JSON.stringify({ state: targetState }));
	}

	onMount(() =>
		subscribe(device.topic, (payload) => {
			deviceState = getState(payload) ?? deviceState;
		})
	);
</script>

<T.Group position={toArray(device.position)}>
	<!-- Hitbox -->
	<T.Mesh onclick={handleClick}>
		<T.SphereGeometry args={[0.25]} />
		<T.MeshStandardMaterial transparent {opacity} {color} />
	</T.Mesh>

	<LightModel {scale} position.z={24 * scale} />

	{#if isOn}
		<!-- Physically based lighting (three r155+): intensity scaled by π vs. the old legacy value 0.1 -->
		<T.PointLight intensity={0.1 * Math.PI} />
	{/if}
</T.Group>
