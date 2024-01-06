<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "$lib/components/Scene.svelte";
  import { orbitControlsEnabled, createMode } from "$lib/states";
  import { connected as mqttConnected } from "$lib/mqtt";
  import Fab, { Icon } from "@smui/fab";
  import Dialog, { Content, Actions } from "@smui/dialog";
  import CircularProgress from "@smui/circular-progress";
  import LoginForm from "$lib/components/LoginForm.svelte";
</script>

<!-- TODO: could have Scene code directly here -->

{#if $mqttConnected}
  <div class="threejs_wrapper">
    <Canvas>
      <Scene />
    </Canvas>
  </div>
{:else}
  <LoginForm />
{/if}

<Fab color="primary" href="/config" class="settings_button">
  <Icon class="material-icons">settings</Icon>
</Fab>

<style>
  :global(.settings_button) {
    position: fixed;
    top: 2em;
    left: 2em;
  }

  :global(body) {
    margin: 0;
  }

  .threejs_wrapper {
    width: 100vw;
    height: 100vh;
    background: rgb(13, 19, 32);
    background: linear-gradient(
      180deg,
      rgba(13, 19, 32, 1) 0%,
      rgba(8, 12, 21, 1) 100%
    );
  }
</style>
