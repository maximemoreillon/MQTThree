<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import type { Vector3 } from "three";
  import { client, on } from "$lib/mqtt";
  import MQTT from "paho-mqtt";
  import { onMount } from "svelte";
  import LightModel from "./LightModel.svelte";

  interactivity();

  export let device: any;

  const payloadOn = device.payload?.on || "on";
  const payloadOff = device.payload?.off || "off";

  const scale = 0.015;

  let state: string = payloadOff;
  $: isOn = state.toLowerCase() === payloadOn;
  $: color = isOn ? "#ffff00" : "#ffffff";
  $: opacity = isOn ? 0.5 : 0.25;

  function handleClick() {
    // state = state == "on" ? "off" : "on"
    if (!client.isConnected()) return;
    const targetState = state == payloadOn ? payloadOff : payloadOn;
    const payload = JSON.stringify({ state: targetState });
    const message = new MQTT.Message(payload);
    message.destinationName = device.commandTopic;
    client.send(message);
  }

  // TODO: subscribe if both mounted and mqtt connected
  onMount(() => {
    on("connected", () => {
      client.subscribe(device.topic);
    });

    on("message", (message: MQTT.Message) => {
      if (message.destinationName !== device.topic) return;
      const payload = JSON.parse(message.payloadString);
      state = payload.state;
    });

    if (client.isConnected()) client.subscribe(device.topic);
  });
</script>

<T.Group position={device.position.toArray()}>
  <!-- Hitbox -->
  <T.Mesh on:click={handleClick}>
    <T.SphereGeometry args={[0.25]} />
    <T.MeshStandardMaterial transparent {opacity} {color} />
  </T.Mesh>

  <LightModel {scale} position.z={24 * scale} />

  {#if isOn}
    <T.PointLight intensity={0.1} />
  {/if}
</T.Group>
