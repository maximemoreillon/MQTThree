<script lang="ts">
  import { init as mqttInit, client } from "$lib/mqtt";
  import { onMount } from "svelte";

  $: connected = $client?.isConnected() ? "Connected" : "Disconnected";

  onMount(() => {
    mqttInit();
  });
</script>

<slot />

<div class="mqttStatus">{connected}</div>

<style>
  .mqttStatus {
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 1em;
    background-color: white;
  }
</style>
