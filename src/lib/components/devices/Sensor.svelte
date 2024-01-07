<script lang="ts">
  import { T } from "@threlte/core";
  import { Texture, SpriteMaterial } from "three";
  import { client, on } from "$lib/mqtt";
  import { onMount } from "svelte";
  import type MQTT from "paho-mqtt";

  export let device: any;

  let spriteMaterial: SpriteMaterial;

  function drawTexture(value: number | string) {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const fontSize = 80;
    const text = `${value} ${device.unit}`;
    const x = 0.5 * canvas.width;
    const y = 0.5 * canvas.height;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "#ff0000";
    ctx.fillText(text, x, y);

    const texture = new Texture(canvas);
    texture.needsUpdate = true;
    spriteMaterial = new SpriteMaterial({ map: texture });
  }

  onMount(() => {
    on("connected", () => {
      client.subscribe(device.topic);
    });

    on("message", (message: MQTT.Message) => {
      if (message.destinationName !== device.topic) return;
      const payload = JSON.parse(message.payloadString);
      const value = Math.round(payload[device.key] * 10) / 10;
      drawTexture(value);
    });

    if (client.isConnected()) client.subscribe(device.topic);
  });
</script>

<T.Sprite args={[spriteMaterial]} position={device.position.toArray()}
></T.Sprite>
