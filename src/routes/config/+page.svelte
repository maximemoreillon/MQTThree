<script lang="ts">
  import axios from "axios";

  let fileList: FileList;

  async function handleSumbit() {
    const body = new FormData();
    body.append("model", fileList[0]);

    const { data } = await axios.post("/model", body);
    console.log(data);
  }
</script>

<div>
  <form on:submit|preventDefault={() => handleSumbit()}>
    <input type="file" accept=".glb" bind:files={fileList} />
    <button type="submit">Upload</button>
  </form>

  <a href="/">Home</a>
</div>
