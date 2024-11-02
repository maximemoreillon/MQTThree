<!-- PROBLEM: This page can be accessed without being authenticated -->
<script lang="ts">
  import Card, { Content } from "@smui/card";
  import Button, { Label, Icon } from "@smui/button";
</script>

<main>
  <div>
    <Button href="/" variant="raised">
      <Icon class="material-icons">arrow_left</Icon>

      <Label>Return</Label>
    </Button>
  </div>

  <Card>
    <Content>
      <h2>Model</h2>
      <form method="POST" action="?/modelUpload" enctype="multipart/form-data">
        <input type="file" accept=".glb" name="model" />
        <Button type="submit" variant="raised">
          <Icon class="material-icons">upload</Icon>
          <Label>Upload</Label>
        </Button>
      </form>
    </Content>
  </Card>
  <Card>
    <Content>
      <h2>Devices</h2>
      <form method="POST" action="?/configUpload" enctype="multipart/form-data">
        <input type="file" accept=".yaml,.yml" name="config" />
        <Button type="submit" variant="raised">
          <Icon class="material-icons">upload</Icon>
          <Label>Upload</Label>
        </Button>
      </form>
    </Content>
  </Card>
</main>

<style>
  main {
    max-width: 30rem;
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    gap: 2em;
    padding: 2em;
  }

  form {
    display: flex;
    align-items: center;
    gap: 1em;
  }

  h2 {
    font-size: x-large;
    margin: 0;
  }

  form input[type="file"] {
    flex-grow: 1;
    border: 1px solid white;
    padding: 1em;
    border-radius: 0.5em;
    cursor: pointer;
  }

  /* input[type="file"]::file-selector-button {

  } */
</style>
