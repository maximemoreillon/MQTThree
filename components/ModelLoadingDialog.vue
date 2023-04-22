<template>
  <v-dialog v-model="dialog" width="40rem">
    <v-card class="pa-5">
      <v-row justify="center">
        <v-col cols="auto"> Loading model...</v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const dialog = ref(false)

const threejsApp = useThreejsApp()

watch(threejsApp, () => {
  if (threejsApp.value) {
    threejsApp.value.onModelLoadStart = () => {
      dialog.value = true
    }
    threejsApp.value.onModelLoadEnd = () => {
      dialog.value = false
    }
  }
})
</script>
