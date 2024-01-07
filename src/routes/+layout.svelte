<script lang="ts">
  import { init as mqttInit } from "$lib/mqtt";
  import { onMount } from "svelte";

  onMount(async () => {
    mqttInit();
  });
</script>

<slot />
