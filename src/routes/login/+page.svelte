<!-- This is using the default form action as it helps setting cookies -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<form method="post" use:enhance>
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
	{#if form?.message}<p class="error">{form.message}</p>{/if}
	<button type="submit" class="button">
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

	.error {
		color: var(--error);
		margin: 0;
	}
</style>
