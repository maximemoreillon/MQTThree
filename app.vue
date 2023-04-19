<template>
  <v-app>
    <v-main>
      <ModelUploadDialog />
      <ClientOnly>
        <Renderer />
      </ClientOnly>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup></script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

main {
  display: flex;
}
</style>
