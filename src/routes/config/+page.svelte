<script lang="ts">
  import ModelUploadForm from "$lib/components/ModelUploadForm.svelte";
  import ConfigUploadForm from "$lib/components/ConfigUploadForm.svelte";
</script>

<div>
  <h3>Model</h3>
  <ModelUploadForm />
  <h3>Config</h3>
  <ConfigUploadForm />

  <a href="/">Home</a>
</div>
