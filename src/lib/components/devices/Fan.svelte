<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { onMount } from 'svelte';
	import { publish, subscribe } from '#lib/mqtt.svelte.ts';
	import { getState, sameState, toArray, toRotation, type FanDevice } from '#lib/devices.ts';
	import FanModel from './FanModel.svelte';

	let { device }: { device: FanDevice } = $props();

	const scale = 0.015;
	const opacity = 0.25;
	const rotationSpeed = 10; // rad/s
	const payloadOn = $derived(device.payload.on);
	const payloadOff = $derived(device.payload.off);

	let deviceState = $state<string | undefined>();
	const isOn = $derived(sameState(deviceState, payloadOn));
	const color = $derived(isOn ? '#00ff00' : '#ffffff');

	let angle = $state(0);
	useTask((delta) => {
		if (isOn) angle += rotationSpeed * delta;
	});

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

<T.Group position={toArray(device.position)} rotation={toRotation(device.rotation)}>
	<!-- Hitbox -->
	<T.Mesh onclick={handleClick}>
		<T.SphereGeometry args={[0.25]} />
		<T.MeshStandardMaterial transparent {opacity} {color} />
	</T.Mesh>

	<FanModel {scale} rotation.x={angle} />
</T.Group>
