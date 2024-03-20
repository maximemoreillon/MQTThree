<script lang="ts">
  import { T } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import AxisHandle from "./AxisHandle.svelte";
  import { Vector3 } from "three";
  interactivity();

  export let position = new Vector3(0, 0, 0);

  let selected = false;

  $: color = selected ? "#c00000" : "#666666";
</script>

<T.Mesh position={position.toArray()} on:click={() => (selected = !selected)}>
  <T.BoxGeometry />
  <T.MeshStandardMaterial {color} />
</T.Mesh>

{#if selected}
  <AxisHandle bind:position axis="x" />
  <AxisHandle bind:position axis="y" />
  <AxisHandle bind:position axis="z" />
{/if}
