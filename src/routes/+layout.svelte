<script lang="ts">
	import '../app.css';
	import { untrack } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { connect, hasClient } from '#lib/mqtt.svelte.ts';

	let { children } = $props();

	async function enforceAuth() {
		// Once created, the MQTT client handles reconnections by itself
		if (hasClient()) return;
		try {
			const response = await fetch('/api/mqttcredentials');
			if (!response.ok) throw new Error(`Failed to get MQTT credentials (${response.status})`);
			const { username, password } = await response.json();
			connect(username, password);
		} catch (error) {
			console.error(error);
			goto('/login');
		}
	}

	$effect(() => {
		if (page.url.pathname !== '/login') untrack(enforceAuth);
	});
</script>

{@render children()}
