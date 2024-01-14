<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "$lib/components/Scene.svelte";
  import { orbitControlsEnabled, createMode } from "$lib/unused/states";
  import { connected as mqttConnected } from "$lib/mqtt";
  import Fab, { Icon } from "@smui/fab";
  import Dialog, { Content, Actions } from "@smui/dialog";
  import CircularProgress from "@smui/circular-progress";
  import { goto } from "$app/navigation";

  import { login as mqttLogin } from "$lib/mqtt";
  import { onMount } from "svelte";
  import axios from "axios";

  let modelLoaded = false;
</script>

{#if $mqttConnected}
  <div class="threejs_wrapper">
    <Canvas>
      <Scene
        on:modelLoad={() => (modelLoaded = true)}
        on:modelError={() => (modelLoaded = true)}
      />
    </Canvas>
  </div>

  <Dialog open={!modelLoaded} scrimClickAction="" escapeKeyAction="">
    <Content class="modal_content">
      <CircularProgress style="height: 3em; width: 3em; " indeterminate />
      <span>Loading model...</span>
    </Content>
    <!-- Dummy button to deal with focusTrap errors -->
    <button style="opacity: 0; position: absolute" />
  </Dialog>
{:else}
  <Dialog open={!$mqttConnected} scrimClickAction="" escapeKeyAction="">
    <Content class="modal_content">
      <CircularProgress style="height: 3em; width: 3em; " indeterminate />
      <span>Connecting to MQTT...</span>
    </Content>
    <!-- Dummy button to deal with focusTrap errors -->
    <button style="opacity: 0; position: absolute" />
  </Dialog>
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

  :global(.modal_content) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1em;
    padding: 2em;
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
