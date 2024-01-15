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
  import CircularProgress from "@smui/circular-progress";

  let authenticating = true;

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

  // Watching pathname
  $: if (browser && $page.url.pathname !== "/login") enforeAuth();
</script>

<!-- TODO: have an app wall here -->
<slot />
