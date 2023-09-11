<script lang="ts">
  import { init as mqttInit, connected as mqttConnected } from "$lib/mqtt";
  import { onMount } from "svelte";

  
  onMount(() => {
    mqttInit();
  });
</script>

<slot />


