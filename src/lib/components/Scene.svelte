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
  import SelectableCube from "./SelectableCube.svelte";
  import Light from "./Light.svelte";
  import { orbitControlsEnabled, createMode } from "$lib/states";
  import { Vector3 } from "three";
  import axios from "axios";
  import { onMount } from "svelte";

  interactivity();

  let cubes: any[] = [];

  let devices: any[] = [];
  onMount(async () => {
    const { data } = await axios.get("/devices");
    devices = data
      .map((d: any) => ({
        ...d,
        position: new Vector3(d.position.x, d.position.y, d.position.z),
      }))
      .filter((d: any) => d.type === "light");
  });
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

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

<Grid
  position.y={0}
  cellColor="#ffffff"
  sectionColor="#ffffff"
  sectionThickness={0}
  fadeDistance={25}
  cellSize={2}
/>

<!-- Pointer Events do not work -->
<!-- <T.Plane
  args={[new Vector3(0, 1, 0), 0]}
  on:pointermove={() => console.log("hi")}
/> -->

<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />

{#each devices as device}
  <Light
    commandTopic={device.commandTopic}
    position={device.position}
    topic={device.topic}
  />
{/each}

<!-- TODO: loader -->
<GLTF
  url="/model"
  interactive
  on:load={(e) => {
    console.log(e);
  }}
/>

<!-- {#each cubes as cube}
  <SelectableCube position={cube}>
    <T.BoxGeometry />
    <T.MeshNormalMaterial />
  </SelectableCube>
{/each} -->
