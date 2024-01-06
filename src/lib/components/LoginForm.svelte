<script lang="ts">
  import { login as mqttLogin } from "$lib/mqtt";
  import Button, { Label, Icon as ButtonIcon } from "@smui/button";
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";
  import HelperText from "@smui/textfield/helper-text";

  let userName = "";
  let password = "";
</script>

<form on:submit|preventDefault={() => mqttLogin(userName, password)}>
  <Textfield bind:value={userName} label="Username">
    <Icon class="material-icons" slot="leadingIcon">person</Icon>
  </Textfield>
  <Textfield bind:value={password} label="Password">
    <Icon class="material-icons" slot="leadingIcon">lock</Icon>
  </Textfield>
  <Button type="submit">
    <ButtonIcon class="material-icons">login</ButtonIcon>
    <Label>Login</Label>
  </Button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 30rem;
    margin-inline: auto;
    gap: 1em;
  }
</style>
