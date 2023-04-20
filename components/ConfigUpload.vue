<template>
  <v-row align="baseline">
    <v-col>
      <v-file-input label="Config" v-model="file" accept=".yaml,.yml" />
    </v-col>
    <v-col cols="auto">
      <v-btn @click="upload()" prepend-icon="mdi-upload" :loading="loading">
        Upload
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup type="ts">

import axios from 'axios'


const dialog = ref(false)
const file = ref()
const loading = ref(false)

const upload = async () => {
  loading.value = true
  const body = new FormData()
  body.append("config", file.value[0])
  const headers = { "Content-Type": "multipart/form-data" }

  try {
    await axios.post(`/api/config`, body, { headers })
    alert('Upload finished, please refresht the page')
    // location.reload()
  } catch (error) {
    alert(`Upload failed`)
    console.error(error)
  } finally {
    loading.value = false
  }

}
</script>
