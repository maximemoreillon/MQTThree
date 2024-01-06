<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import { orbitControlsEnabled, createMode } from "$lib/states";
  import { connected as mqttConnected } from "$lib/mqtt";
  import Fab, { Icon } from "@smui/fab";
</script>

<Canvas>
  <Scene />
</Canvas>

<Fab color="primary" href="/config" class="settings_button">
  <Icon class="material-icons">settings</Icon>
</Fab>

<style>
  :global(.settings_button) {
    position: fixed;
    top: 2em;
    left: 2em;
  }
</style>
