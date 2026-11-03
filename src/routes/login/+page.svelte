<!-- Credentials are checked by the server against the MQTT broker, then kept in the browser to connect to it directly -->
<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '$app/forms';
	import { saveCredentials } from '#lib/credentials.ts';
	import { disconnect } from '#lib/mqtt.svelte.ts';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	let pending = $state(false);

	const handleSubmit: SubmitFunction = ({ formData }) => {
		pending = true;
		const username = String(formData.get('username'));
		const password = String(formData.get('password'));
		const remember = formData.get('remember') === 'on';

		return async ({ result }) => {
			pending = false;
			if (result.type === 'redirect') {
				disconnect();
				saveCredentials({ username, password }, remember);
			}
			await applyAction(result);
		};
	};
</script>

<form method="post" use:enhance={handleSubmit}>
	<label class="field">
		<span class="material-icons">person</span>
		<input name="username" placeholder="Username" autocomplete="username" required />
	</label>
	<label class="field">
		<span class="material-icons">lock</span>
		<input
			name="password"
			type="password"
			placeholder="Password"
			autocomplete="current-password"
			required
		/>
	</label>
	<label class="remember">
		<input type="checkbox" name="remember" />
		Remember me on this device
	</label>
	{#if form?.message}<p class="error">{form.message}</p>{/if}
	<button type="submit" class="button" disabled={pending}>
		<span class="material-icons">login</span>
		Login
	</button>
</form>

<style>
	form {
		margin-top: 25vh;
		display: flex;
		flex-direction: column;
		max-width: 20rem;
		margin-inline: auto;
		gap: 1em;
	}

	.field {
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.5em 0.75em;
		border: 1px solid var(--outline);
		border-radius: 4px;
	}

	.field input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		color: inherit;
		font: inherit;
	}

	.remember {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.error {
		color: var(--error);
		margin: 0;
	}
</style>
