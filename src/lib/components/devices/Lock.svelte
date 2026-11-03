<script lang="ts">
	import { T } from '@threlte/core';
	import { onMount } from 'svelte';
	import { publish, subscribe } from '#lib/mqtt.svelte.ts';
	import { getState, sameState, toArray, toRotation, type LockDevice } from '#lib/devices.ts';
	import LockModel from './LockModel.svelte';

	let { device }: { device: LockDevice } = $props();

	const opacity = 0.25;
	const payloadLocked = $derived(device.payload?.locked ?? 'locked');
	const payloadUnlocked = $derived(device.payload?.unlocked ?? 'unlocked');

	let deviceState = $state<string | undefined>();
	const isLocked = $derived(sameState(deviceState, payloadLocked));
	const color = $derived(isLocked ? '#00ff00' : '#ff0000');

	function handleClick() {
		const targetState = isLocked ? payloadUnlocked : payloadLocked;
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
	<LockModel scale={[0.06, 0.06, 0.06]} {color} />
</T.Group>
