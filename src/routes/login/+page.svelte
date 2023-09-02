<script lang="ts">
  import { client } from "$lib/mqtt";
  import type Paho from "paho-mqtt";

  const { VITE_PUBLIC_MQTT_USE_SSL } = import.meta.env;

  let userName: string;
  let password: string;

  function onFailure(error: Paho.ErrorWithInvocationContext) {
    console.error(error);
  }

  function onSuccess() {
    console.log("MQTT connected");
  }

  function login() {
    const connectionOptions = {
      onSuccess,
      onFailure,
      userName,
      password,
      useSSL: !!VITE_PUBLIC_MQTT_USE_SSL,
      keepAliveInterval: 30,
      reconnect: true,
    };

    $client.connect(connectionOptions);
  }
</script>

<form on:submit|preventDefault={login}>
  <input type="text" bind:value={userName} />
  <input type="password" bind:value={password} />
  <input type="submit" />
</form>

<a href="/">Home</a>
