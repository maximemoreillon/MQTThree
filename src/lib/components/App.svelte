<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import { orbitControlsEnabled, createMode } from "$lib/states";
</script>

<Canvas>
  <Scene />
</Canvas>

<div class="controls_wrapper">
  <button on:click={() => orbitControlsEnabled.set(!$orbitControlsEnabled)}>
    OrbitControls {$orbitControlsEnabled ? "Enabled" : "Disabled"}
  </button>
  <button on:click={() => createMode.set(!$createMode)}>
    CreateMode {$createMode ? "Enabled" : "Disabled"}
  </button>
  <a href="/config">Config</a>
</div>

<style>
  .controls_wrapper {
    position: fixed;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
</style>
