<script lang="ts">
  import { login } from "$lib/mqtt";

  const { VITE_PUBLIC_MQTT_USE_SSL } = import.meta.env;

  let userName: string;
  let password: string;

  function submitLoginForm(){
    login(userName, password)
  }

  
</script>

<form on:submit|preventDefault={submitLoginForm}>
  <input type="text" bind:value={userName} />
  <input type="password" bind:value={password} />
  <input type="submit" />
</form>

<a href="/">Home</a>
