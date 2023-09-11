<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity, Grid } from "@threlte/extras";
  import type { Vector3 } from "three";
  import { orbitControlsEnabled } from "$lib/states";

  addEventListener("mouseup", () => {
    orbitControlsEnabled.set(true);
    grabbed = false;
  });

  interactivity();

  export let position: Vector3;
  export let axis: "x" | "y" | "z";

  const axisMap = { x: 0, y: 1, z: 2 };
  const axisColorMap = { x: "red", y: "green", z: "blue" };

  let hovered = false;
  let grabbed = false;

  $: handlePosition = position
    .clone()
    .setComponent(axisMap[axis], position[axis] + 1);

  $: handleOpacity = hovered ? 1 : 0.5;

  let planeRotation = [-0.5 * Math.PI, 0, 0];
  planeRotation[axisMap[axis]] = -0.5 * Math.PI;

  function startGrab(e: any) {
    orbitControlsEnabled.set(false);
    grabbed = true;
  }

  function handleGrab(e: any) {
    if (!grabbed) return;
    // TODO: take into account offset
    position[axis] = e.point[axis] - 1;
  }
</script>

<T.Mesh
  on:pointerdown={startGrab}
  on:pointerenter={() => (hovered = true)}
  on:pointerleave={() => (hovered = false)}
  position={handlePosition.toArray()}
>
  <T.BoxGeometry args={[0.5, 0.5, 0.5]} />
  <T.MeshStandardMaterial
    color={axisColorMap[axis]}
    transparent
    opacity={handleOpacity}
  />
</T.Mesh>

<!-- Ideally, would be the projection of the ray from the camera onto the selected axis -->
<!-- PROBLEM: position does not work -->
{#if grabbed}
  <Grid
    on:pointermove={handleGrab}
    infiniteGrid
    position={position.toArray()}
    rotation={planeRotation}
    cellColor={axisColorMap[axis]}
    sectionThickness={0}
    fadeDistance={25}
    cellSize={2}
  />
  <!-- <T.Mesh
    on:pointermove={handleGrab}
    position={position.toArray()}
    rotation={planeRotation}
  >
    <T.PlaneGeometry />
    <T.MeshNormalMaterial />
  </T.Mesh> -->
{/if}
