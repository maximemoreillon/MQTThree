<script lang="ts">
	import { T } from '@threlte/core';
	import { onMount } from 'svelte';
	import { CanvasTexture, SpriteMaterial } from 'three';
	import { subscribe } from '#lib/mqtt.svelte.ts';
	import { toArray, type SensorDevice } from '#lib/devices.ts';

	let { device }: { device: SensorDevice } = $props();

	const canvas = document.createElement('canvas');
	canvas.width = 600;
	canvas.height = 600;
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	const texture = new CanvasTexture(canvas);
	const material = new SpriteMaterial({ map: texture });

	function drawText(text: string) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const x = 0.5 * canvas.width;
		const y = 0.5 * canvas.height;
		ctx.font = '100px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.strokeText(text, x, y);
		ctx.fillStyle = '#ff0000';
		ctx.fillText(text, x, y);
		texture.needsUpdate = true;
	}

	onMount(() => {
		drawText('–');
		const unsubscribe = subscribe(device.topic, (payload) => {
			if (typeof payload !== 'object' || payload === null) return;
			const raw = Number((payload as Record<string, unknown>)[device.key]);
			if (Number.isNaN(raw)) return;
			const value = Math.round(raw * 10) / 10;
			drawText(`${value} ${device.unit ?? ''}`.trim());
		});

		return () => {
			unsubscribe();
			texture.dispose();
			material.dispose();
		};
	});
</script>

<T.Sprite args={[material]} position={toArray(device.position)} />
