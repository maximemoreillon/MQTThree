<template>
  <LoginDialog />
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import MQTT from "paho-mqtt"

import { v4 as uuidv4 } from "uuid"

// Create the MQTT client
// Needs to be created here because if done in utils, getting a Nuxt instance not found or MQTT not supported in this browser
const mqtt = useMqtt()
const runtimeConfig = useRuntimeConfig()
const { mqttHost, mqttPort } = runtimeConfig.public
mqtt.value = new MQTT.Client(mqttHost, Number(mqttPort), "/", uuidv4())

const canvas = ref()

mqtt.value.onConnected = () => {
  const { innerWidth: width, innerHeight: height } = window
  canvas.value.width = width
  canvas.value.height = height
  new ThreejsApp(canvas.value, mqtt.value)
}
</script>
