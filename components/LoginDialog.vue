<template>
  <v-dialog v-model="visible" max-width="30rem" persistent>
    <v-card>
      <v-card-text>
        <v-form class="text-center" @submit.prevent="login()">
          <v-text-field
            prepend-icon="mdi-account"
            label="Username"
            v-model="username"
          />

          <v-text-field
            prepend-icon="mdi-lock"
            label="Password"
            type="Password"
            v-model="password"
          />

          <v-btn
            type="submit"
            :loading="loading"
            prepend-icon="mdi-login"
            variant="text"
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const mqttClient = useMqttClient()
const runtimeConfig = useRuntimeConfig()
const { mqttUseSsl } = runtimeConfig.public

const visible = ref(true)
const username = ref("")
const password = ref("")
const loading = ref(false)

onMounted(() => {
  if (!mqttClient.value.isConnected()) connect()
  else visible.value = false
})

const login = () => {
  const localStorageContent = JSON.stringify({
    username: username.value,
    password: password.value,
  })
  localStorage.setItem("mqtt", localStorageContent)
  connect()
}

// Starting to believe here is not the right place for connect
const connect = () => {
  loading.value = true
  const localStorageContent = localStorage.getItem("mqtt")
  if (!localStorageContent) {
    loading.value = false
    console.log("credentials do not exist")
    return
  }
  const { username, password } = JSON.parse(localStorageContent)

  mqttClient.value.connect({
    onSuccess,
    onFailure,
    userName: username,
    password: password,
    useSSL: !!mqttUseSsl,
    keepAliveInterval: 30,
    reconnect: true,
  })
}

const onSuccess = () => {
  // NOTE: This also gets called when reconnecting
  loading.value = false
  visible.value = false
}
const onFailure = (error: any) => {
  console.error(error)
  loading.value = false
  // TODO: snackbar?
}
</script>
