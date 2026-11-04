<!-- Credentials are checked by the server against the MQTT broker, then kept in the browser to connect to it directly -->
<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '$app/forms';
	import LogInIcon from '@lucide/svelte/icons/log-in';
	import * as Alert from '#lib/components/ui/alert/index.ts';
	import { Button } from '#lib/components/ui/button/index.ts';
	import * as Card from '#lib/components/ui/card/index.ts';
	import { Checkbox } from '#lib/components/ui/checkbox/index.ts';
	import { Input } from '#lib/components/ui/input/index.ts';
	import { Label } from '#lib/components/ui/label/index.ts';
	import { Spinner } from '#lib/components/ui/spinner/index.ts';
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

<div class="flex min-h-svh items-center justify-center p-4">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>MQTThree</Card.Title>
			<Card.Description>Log in with your MQTT broker account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="post" use:enhance={handleSubmit} class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<Label for="username">Username</Label>
					<Input id="username" name="username" autocomplete="username" required />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
					/>
				</div>
				<div class="flex items-center gap-2">
					<Checkbox id="remember" name="remember" value="on" />
					<Label for="remember">Remember me on this device</Label>
				</div>
				{#if form?.message}
					<Alert.Root variant="destructive">
						<Alert.Title>{form.message}</Alert.Title>
					</Alert.Root>
				{/if}
				<Button type="submit" disabled={pending}>
					{#if pending}<Spinner />{:else}<LogInIcon />{/if}
					Log in
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
