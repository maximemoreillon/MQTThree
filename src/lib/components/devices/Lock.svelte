<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import type { Vector3 } from "three";
  import { client, on, connected } from "$lib/mqtt";
  import MQTT from "paho-mqtt";
  import { onMount } from "svelte";
  import LockModel from "./LockModel.svelte";

  interactivity();

  export let device: any;

  let state: string = "unlocked";
  $: isLocked = state.toLowerCase() === "locked";
  $: color = isLocked ? "#00ff00" : "#ff0000";
  const opacity = 0.25;

  function handleClick() {
    if (!client.isConnected()) return;
    const targetState = isLocked ? "unlocked" : "locked";
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
    if (client.isConnected()) {
      client.subscribe(device.topic);
    }

    on("message", (message: MQTT.Message) => {
      if (message.destinationName !== device.topic) return;
      const payload = JSON.parse(message.payloadString);
      state = payload.state;
    });
  });
</script>

<T.Group position={device.position.toArray()}>
  <!-- Hitbox -->
  <T.Mesh on:click={handleClick}>
    <T.SphereGeometry args={[0.25]} />
    <T.MeshStandardMaterial transparent {opacity} {color} />
  </T.Mesh>
  <LockModel scale={[0.06, 0.06, 0.06]} {color} />
</T.Group>
