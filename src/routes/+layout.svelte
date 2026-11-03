<script lang="ts">
	import '../app.css';
	import { untrack } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { connect, disconnect, hasClient, mqttState } from '#lib/mqtt.svelte.ts';
	import { clearCredentials, loadCredentials } from '#lib/credentials.ts';

	let { children } = $props();

	function ensureConnected() {
		// Once created, the MQTT client handles reconnections by itself
		if (hasClient()) return;
		const credentials = loadCredentials();
		// Logged in (the server let us through) but credentials are gone, e.g. new browser session
		if (!credentials) return goto('/login');
		connect(credentials.username, credentials.password);
	}

	$effect(() => {
		if (page.url.pathname !== '/login') untrack(ensureConnected);
	});

	// The broker rejected the stored credentials, e.g. password changed
	$effect(() => {
		if (!mqttState.authFailed) return;
		untrack(() => {
			clearCredentials();
			disconnect();
			goto('/login');
		});
	});
</script>

{@render children()}
