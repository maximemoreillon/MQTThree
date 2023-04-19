<template>
  <v-dialog v-model="dialog" width="30rem">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" position="absolute">
        Upload model
      </v-btn>
    </template>

    <v-card>
      <v-card-text>
        <v-file-input label="Model" v-model="modelFile" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="dialog = false"> Close </v-btn>
        <v-btn @click="upload()">Upload</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup type="ts">

import axios from 'axios'


const dialog = ref(false)
const modelFile = ref()
const loading = ref(false)

const upload = async () => {
  loading.value = true
  const body = new FormData()
  body.append("model", modelFile.value[0])
  const headers = { "Content-Type": "multipart/form-data" }

  try {
    const { data } = await axios.post(`/api//model`, body, { headers })
    console.log(data)
  } catch (error) {
    alert(`Upload failed`)
    console.error(error)
  } finally {
    loading.value = false
  }

}
</script>
