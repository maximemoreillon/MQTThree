<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.ts';
	import { Spinner } from '#lib/components/ui/spinner/index.ts';

	let { message }: { message: string } = $props();
</script>

<div class="fixed inset-0 grid place-items-center bg-black/50" role="status">
	<Card.Root>
		<Card.Content class="flex flex-col items-center gap-4 px-8">
			<Spinner class="size-8" />
			<span>{message}</span>
		</Card.Content>
	</Card.Root>
</div>
