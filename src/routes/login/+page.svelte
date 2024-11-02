<!-- This is using the default form action as it helps setting cookies -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import Button, { Label, Icon as ButtonIcon } from "@smui/button";
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";
</script>

<form method="POST" use:enhance>
  <h3>Login</h3>
  <Textfield label="Username" input$name="username" value="">
    <Icon class="material-icons" slot="leadingIcon">person</Icon>
  </Textfield>
  <Textfield label="Password" type="password" input$name="password" value="">
    <Icon class="material-icons" slot="leadingIcon">lock</Icon>
  </Textfield>
  <Button type="submit">
    <ButtonIcon class="material-icons">login</ButtonIcon>
    <Label>Login</Label>
  </Button>
</form>

<style>
  form {
    margin-top: 4rem;
    display: flex;
    flex-direction: column;
    max-width: 20rem;
    margin-inline: auto;
    gap: 1em;
  }
</style>
