<template>
  <v-row align="baseline">
    <v-col>
      <v-file-input label="Config" v-model="file" accept=".yaml,.yml" />
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
  body.append("config", file.value[0])
  const headers = { "Content-Type": "multipart/form-data" }

  try {
    await axios.post(`/api/config`, body, { headers })
    location.reload()
  } catch (error) {
    alert(`Upload failed`)
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
