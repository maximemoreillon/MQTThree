<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import type { Vector3 } from "three";
  import { client, on } from "$lib/mqtt";
  import MQTT from "paho-mqtt";
  import { onMount } from "svelte";
  import LightModel from "$lib/components/LightModel.svelte";

  interactivity();

  export let position: Vector3;
  export let commandTopic: string;
  export let topic: string;

  const scale = 0.015;

  let state: string = "off";
  $: isOn = state.toLowerCase() === "on";
  $: color = isOn ? "#00c000" : "#c00000";

  function handleClick() {
    if (!client.isConnected()) return;
    const payload = JSON.stringify({ state: "toggle" });
    const message = new MQTT.Message(payload);
    message.destinationName = commandTopic;
    client.send(message);
  }

  // TODO: subscribe if both mounted and mqtt connected
  onMount(() => {

    on("connected", () => {
      client.subscribe(topic);
    })

    on("message", (message: MQTT.Message) => {
      if (message.destinationName !== topic) return;
      const payload = JSON.parse(message.payloadString);
      state = payload.state;
    });



    if (client.isConnected()) client.subscribe(topic);
  });
</script>

<!-- TODO: Bulb model -->
<T.Group position={position.toArray()}>
  <!-- Hitbox -->
  <T.Mesh on:click={handleClick}>
    <T.BoxGeometry args={[0.5, 0.5, 0.5]} />
    <T.MeshStandardMaterial visible={true} {color}/>
  </T.Mesh>

  <LightModel {scale} position.z={24 * scale} />

  {#if isOn}
    <T.PointLight intensity={0.2} />
  {/if}
</T.Group>
