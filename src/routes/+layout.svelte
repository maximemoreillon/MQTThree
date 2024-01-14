<script lang="ts">
  import {
    init as mqttInit,
    login as mqttLogin,
    connected as mqttConnected,
  } from "$lib/mqtt";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  let authenticating = false;

  onMount(async () => {
    mqttInit();
  });

  async function enforeAuth() {
    if ($mqttConnected) return;
    try {
      authenticating = true;
      const { data } = await axios.get("/api/mqttcredentials");
      const { username, password } = data;
      mqttLogin(username, password);
    } catch (error) {
      goto("/login");
    } finally {
      authenticating = false;
    }
  }

  $: if (browser && $page.url.pathname !== "/login") {
    enforeAuth();
  }

  // TODO: have a navigation guard here
</script>

<!-- TODO: consider having an Auth wall here -->
<slot />
