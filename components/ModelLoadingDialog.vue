<template>
  <v-dialog v-model="dialog" width="40rem" persistent>
    <v-card class="pa-5">
      <v-row justify="center">
        <v-col cols="auto"> Loading model...</v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-progress-linear :model-value="progress" />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const dialog = ref(false)
const progress = ref(0)
const threejsApp = useThreejsApp()

watch(threejsApp, () => {
  if (!threejsApp.value) return
  dialog.value = true

  threejsApp.value.on("modelLoading", ({ total, loaded }: any) => {
    progress.value = (100 * loaded) / total
  })

  threejsApp.value.on("modelLoaded", () => {
    dialog.value = false
  })

  threejsApp.value.on("modelLoadError", () => {
    alert("Model loading failed")
  })

  // Not working
  // threejsApp.value.onModelLoading = (xhr: any) => {
  //   console.log(xhr)
  // }

  // threejsApp.value.onModelLoaded = () => {
  //   dialog.value = false
  // }
})
</script>
