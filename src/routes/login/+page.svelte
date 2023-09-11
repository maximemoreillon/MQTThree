<script lang="ts">
  import { login } from "$lib/mqtt";

  let userName: string;
  let password: string;
  
</script>

<form on:submit|preventDefault={() => login(userName, password)}>
  <input type="text" bind:value={userName} />
  <input type="password" bind:value={password} />
  <input type="submit" />
</form>

<a href="/">Home</a>
