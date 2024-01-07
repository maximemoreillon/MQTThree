<script lang="ts">
  import {
    init as mqttInit,
    login as mqttLogin,
    connected as mqttConnected,
  } from "$lib/mqtt";
  import { onMount } from "svelte";
  import axios from "axios";
  import { goto } from "$app/navigation";

  onMount(async () => {
    mqttInit();
  });
</script>

<slot />
