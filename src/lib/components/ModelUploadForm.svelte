<script lang="ts">
  import Button, { Label } from "@smui/button";
  import axios from "axios";

  let fileList: FileList;

  async function handleSumbit() {
    const body = new FormData();
    body.append("model", fileList[0]);

    await axios.post("/model", body);
    alert("Upload OK");
  }
</script>

<form on:submit|preventDefault={() => handleSumbit()}>
  <input type="file" accept=".glb" bind:files={fileList} />
  <Button type="submit">
    <Label>Upload</Label>
  </Button>
</form>
