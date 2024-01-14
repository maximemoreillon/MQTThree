<!-- PROBLEM: This page can be accessed without being authenticated -->
<script lang="ts">
  import ModelUploadForm from "$lib/components/ModelUploadForm.svelte";
  import ConfigUploadForm from "$lib/components/ConfigUploadForm.svelte";
</script>

<div class="config_wrapper">
  <h3>Model</h3>
  <ModelUploadForm />
  <h3>Config</h3>
  <ConfigUploadForm />
  <a href="/">Home</a>
</div>

<style>
  .config_wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1em;
    margin: 2em;
  }
</style>
