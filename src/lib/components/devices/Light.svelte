<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import type { Vector3 } from "three";
  import { client, on } from "$lib/mqtt";
  import MQTT from "paho-mqtt";
  import { onMount } from "svelte";
  import LightModel from "./LightModel.svelte";

  interactivity();

  export let position: Vector3;
  export let commandTopic: string;
  export let topic: string;

  const scale = 0.015;

  let state: string = "off";
  $: isOn = state.toLowerCase() === "on";
  $: color = isOn ? "#ffff00" : "#ffffff";
  $: opacity = isOn ? 0.5 : 0.25

  function handleClick() {
    state = state == "on" ? "off" : "on"
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

<T.Group position={position.toArray()}>
  <!-- Hitbox -->
  <T.Mesh on:click={handleClick}>
    <T.SphereGeometry args={[0.25]} />
    <T.MeshStandardMaterial transparent {opacity} {color}/>
  </T.Mesh>

  <LightModel {scale} position.z={24 * scale} />

  {#if isOn}
    <T.PointLight intensity={0.2} />
  {/if}
</T.Group>
