<template>
  <VitePwaManifest />
  <v-app>
    <v-main>
      <ClientOnly>
        <Renderer />
      </ClientOnly>
    </v-main>
  </v-app>
</template>

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
