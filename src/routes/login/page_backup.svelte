<script lang="ts">
  import Button, { Label, Icon as ButtonIcon } from "@smui/button";
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";
  import axios from "axios";
  import { env } from "$env/dynamic/public";
  const { PUBLIC_LOGIN_URL } = env;

  let username = "";
  let password = "";
  let loading = false;

  async function login() {
    loading = true;
    const body = { username, password };
    try {
      const { data } = await axios.post(PUBLIC_LOGIN_URL, body);
      localStorage.setItem("jwt", data.jwt);
    } catch (error) {
      localStorage.removeItem("jwt");
      alert("Login failed");
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={() => login()}>
  <Textfield bind:value={username} label="Username">
    <Icon class="material-icons" slot="leadingIcon">person</Icon>
  </Textfield>
  <Textfield bind:value={password} label="Password" type="password">
    <Icon class="material-icons" slot="leadingIcon">lock</Icon>
  </Textfield>
  <Button type="submit" disabled={loading}>
    <ButtonIcon class="material-icons">login</ButtonIcon>
    <Label>Login</Label>
  </Button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 20rem;
    margin-inline: auto;
    gap: 1em;
  }
</style>
