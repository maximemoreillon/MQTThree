<script lang="ts">
  import {
    init as mqttInit,
    login as mqttLogin,
    connected as mqttConnected,
  } from "$lib/mqtt";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  let authenticating = true;

  onMount(async () => {
    mqttInit();
  });

  async function enforeAuth() {
    if ($mqttConnected) return;
    try {
      authenticating = true;

      const response = await fetch("/api/mqttcredentials");
      const data = await response.json();
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
