<script lang="ts">
  import axios from "axios";

  let fileList: FileList;

  async function handleSumbit() {
    const body = new FormData();
    body.append("devices", fileList[0]);

    const { data } = await axios.post("/api/devices", body);
    alert("Upload OK");
  }
</script>

<form on:submit|preventDefault={() => handleSumbit()}>
  <input type="file" accept=".yaml,.yml" bind:files={fileList} />
  <button type="submit">Upload</button>
</form>
