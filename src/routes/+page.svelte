<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '#lib/components/Scene.svelte';
	import LoadingOverlay from '#lib/components/LoadingOverlay.svelte';
	import { mqttState } from '#lib/mqtt.svelte.ts';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import * as Alert from '#lib/components/ui/alert/index.ts';
	import { Button } from '#lib/components/ui/button/index.ts';

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
	<div class="h-svh w-screen bg-linear-to-b from-[rgb(13_19_32)] to-[rgb(8_12_21)]">
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
	<div class="fixed bottom-8 left-1/2 flex w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2">
		{#each errors as error, index (index)}
			<Alert.Root variant="destructive">
				<Alert.Description class="whitespace-pre-line">{error}</Alert.Description>
			</Alert.Root>
		{/each}
	</div>
{/if}

<Button
	href="/config"
	size="icon-lg"
	variant="secondary"
	class="fixed top-8 left-8 rounded-full shadow-md"
	aria-label="Settings"
>
	<SettingsIcon />
</Button>
