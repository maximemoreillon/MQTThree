<template>
  <v-row align="baseline">
    <v-col>
      <v-file-input label="Model" v-model="file" accept=".gltf,.glb" />
    </v-col>
    <v-col cols="auto">
      <v-btn @click="upload()" icon="mdi-upload" :loading="loading" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import axios from "axios"

const file = ref()
const loading = ref(false)

const upload = async () => {
  loading.value = true
  const body = new FormData()
  body.append("model", file.value[0])
  const headers = { "Content-Type": "multipart/form-data" }

  try {
    await axios.post(`/api/model`, body, { headers })
    location.reload()
  } catch (error) {
    alert(`Upload failed`)
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
