<script lang="ts">
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
  <button type="submit">Upload</button>
</form>
