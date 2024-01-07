<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "$lib/components/Scene.svelte";
  import { orbitControlsEnabled, createMode } from "$lib/states";
  import { connected as mqttConnected } from "$lib/mqtt";
  import Fab, { Icon } from "@smui/fab";
  import Dialog, { Content, Actions } from "@smui/dialog";
  import CircularProgress from "@smui/circular-progress";
  import { goto } from "$app/navigation";

  import { login as mqttLogin } from "$lib/mqtt";
  import { onMount } from "svelte";
  import axios from "axios";

  onMount(async () => {
    if ($mqttConnected) return;
    try {
      const { data } = await axios.get("/api/mqttcredentials");
      const { username, password } = data;
      mqttLogin(username, password);
    } catch (error) {
      // TODO: navigate to login page
      console.error(error);
      goto("/login");
    }
  });
</script>

<!-- TODO: check if mqtt is connected -->
<div class="threejs_wrapper">
  <Canvas>
    <Scene />
  </Canvas>
</div>

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
