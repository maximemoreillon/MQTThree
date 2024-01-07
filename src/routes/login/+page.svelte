<script lang="ts">
  import { enhance } from "$app/forms";
  import Button, { Label, Icon as ButtonIcon } from "@smui/button";
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";
</script>

<form method="post" use:enhance>
  <!-- SMUI Textfields do not support name="" -->
  <!-- <Textfield label="Username" name="username">
    <Icon class="material-icons" slot="leadingIcon">person</Icon>
  </Textfield>
  <Textfield label="Password" type="password" name="password">
    <Icon class="material-icons" slot="leadingIcon">lock</Icon>
  </Textfield> -->
  <input type="text" name="username" />
  <input type="password" name="password" />
  <Button type="submit">
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
