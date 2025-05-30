<script lang="ts">
  import { T } from "@threlte/core";
  import {
    ContactShadows,
    Grid,
    OrbitControls,
    interactivity,
    Text,
    GLTF,
  } from "@threlte/extras";
  import Light from "./devices/Light.svelte";
  import Fan from "./devices/Fan.svelte";
  import Sensor from "./devices/Sensor.svelte";
  import Lock from "./devices/Lock.svelte";
  import { orbitControlsEnabled } from "$lib/unused/states";
  import { Vector3 } from "three";

  import { createEventDispatcher } from "svelte";

  const modelPath = "/api/model";
  const dispatch = createEventDispatcher();

  interactivity();

  export let devices: any[] = [];

  $: formattedDevices = devices.map((d: any) => ({
    ...d,
    position: new Vector3(d.position.x, d.position.y, d.position.z),
  }));
</script>

<T.PerspectiveCamera
  makeDefault
  fov={50}
  on:create={({ ref }) => {
    ref.position.set(-10, 10, 10);
    ref.lookAt(0, 0, 0);
  }}
>
  <OrbitControls enabled={$orbitControlsEnabled} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.2} />

<Grid
  position.y={0}
  cellColor="#ffffff"
  sectionColor="#c00000"
  sectionThickness={2}
  fadeDistance={25}
  cellSize={2}
/>

<!-- Pointer Events do not work on planes-->
<!-- <T.Plane
  args={[new Vector3(0, 1, 0), 0]}
  on:pointermove={() => console.log("hi")}
/> -->

<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />

{#each formattedDevices.filter(({ type }) => type === "light") as device}
  <Light {device} />
{/each}

{#each formattedDevices.filter(({ type }) => type === "fan") as device}
  <Fan {device} />
{/each}

{#each formattedDevices.filter(({ type }) => type === "sensor") as device}
  <Sensor {device} />
{/each}

{#each formattedDevices.filter(({ type }) => type === "lock") as device}
  <Lock {device} />
{/each}

<GLTF
  url={modelPath}
  interactive
  castShadow
  receiveShadow
  on:load={() => dispatch("modelLoad")}
  on:error={() => dispatch("modelError")}
/>
