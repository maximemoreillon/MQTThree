<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import type { Vector3 } from "three";
  import { client } from "$lib/mqtt";
  import MQTT from "paho-mqtt";
  import { onMount } from "svelte";

  interactivity();

  export let position: Vector3;
  export let commandTopic: string;
  // export let topic = "";

  function handleClick() {
    if (!$client.isConnected()) return;
    const payload = JSON.stringify({ state: "toggle" });
    const message = new MQTT.Message(payload);
    message.destinationName = commandTopic;
    $client.send(message);
  }

  // TODO: subscribe if both mounted and mqtt connected
  onMount(() => {});
</script>

<!-- TODO: Bulb model -->
<T.Mesh position={position.toArray()} on:click={handleClick}>
  <T.BoxGeometry />
  <T.MeshNormalMaterial />
</T.Mesh>
