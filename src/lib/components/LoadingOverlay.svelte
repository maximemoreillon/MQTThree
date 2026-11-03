<script lang="ts">
	let { message }: { message: string } = $props();
</script>

<div class="overlay" role="status">
	<div class="card">
		<div class="spinner"></div>
		<span>{message}</span>
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		display: grid;
		place-items: center;
		background: rgb(0 0 0 / 0.5);
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
		padding: 2em;
		border-radius: 8px;
		background: var(--surface);
		color: var(--on-surface);
	}

	.spinner {
		width: 3em;
		height: 3em;
		border: 4px solid var(--primary);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
