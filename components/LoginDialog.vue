<template>
  <v-dialog :model-value="visible" max-width="30rem" persistent>
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

<script setup>
import { ref, onMounted } from "vue"
const props = defineProps({
  visible: Boolean,
})
const username = ref("")
const password = ref("")
const loading = ref(false)

const login = () => {
  const localStorageContent = JSON.stringify({
    username: username.value,
    password: password.value,
  })
  localStorage.setItem("mqtt", localStorageContent)
}
</script>
