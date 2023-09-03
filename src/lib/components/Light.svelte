<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import type { Vector3 } from "three";
  import { client, on } from "$lib/mqtt";
  import MQTT from "paho-mqtt";
  import { onMount } from "svelte";

  interactivity();

  export let position: Vector3;
  export let commandTopic: string;
  export let topic: string;

  function handleClick() {
    if (!$client.isConnected()) return;
    const payload = JSON.stringify({ state: "toggle" });
    const message = new MQTT.Message(payload);
    message.destinationName = commandTopic;
    $client.send(message);
  }

  // TODO: subscribe if both mounted and mqtt connected
  onMount(() => {
    on("message", (message: MQTT.Message) => {
      if (message.destinationName !== topic) return;
      const payload = JSON.parse(message.payloadString);
      console.log(payload);
    });

    if ($client.isConnected()) $client.subscribe(topic);
  });
</script>

<!-- TODO: Bulb model -->
<T.Mesh position={position.toArray()} on:click={handleClick}>
  <T.BoxGeometry />
  <T.MeshNormalMaterial />
</T.Mesh>
