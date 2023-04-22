<template>
  <LoginDialog />
  <SettingsDialog />
  <ModelLoadingDialog />
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import MQTT from "paho-mqtt"

import { v4 as uuidv4 } from "uuid"

// Create the MQTT client
// Needs to be created here because if done in utils, getting a Nuxt instance not found or MQTT not supported in this browser
const mqtt = useMqtt()
const threejsApp = useThreejsApp()

const runtimeConfig = useRuntimeConfig()
const { mqttHost, mqttPort, ambientLightIntensity } = runtimeConfig.public
mqtt.value = new MQTT.Client(mqttHost, Number(mqttPort), "/", uuidv4())

const canvas = ref()

// Maybe not ideal: This will recreate the whole ThreeJs app at each connection
mqtt.value.onConnected = () => {
  const { innerWidth: width, innerHeight: height } = window
  canvas.value.width = width
  canvas.value.height = height
  threejsApp.value = new ThreejsApp({
    canvas: canvas.value,
    mqttClient: mqtt.value,
    ambientLightIntensity,
  })
}
</script>
