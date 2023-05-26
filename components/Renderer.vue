<template>
  <LoginDialog />
  <SettingsDialog />
  <MqttReconnectingDialog />
  <ModelLoadingDialog />
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import MQTT from "paho-mqtt"

import { v4 as uuidv4 } from "uuid"

// Create the MQTT client
// Needs to be created here because if done in utils, getting a Nuxt instance not found or MQTT not supported in this browser
const mqttClient = useMqttClient()
const mqttReconnecting = useMqttReconnecting()
const threejsApp = useThreejsApp()

const runtimeConfig = useRuntimeConfig()
const { mqttHost, mqttPort } = runtimeConfig.public

console.log(`Creating an MQTT client with host ${mqttHost}`)
mqttClient.value = new MQTT.Client(mqttHost, Number(mqttPort), "/", uuidv4())

const canvas = ref()

onMounted(() => {
  const { innerWidth: width, innerHeight: height } = window
  canvas.value.width = width
  canvas.value.height = height
})

mqttClient.value.onConnected = (reconnect: boolean) => {
  console.log("MQTT onConnected event")

  if (reconnect) {
    mqttReconnecting.value = false
    threejsApp.value.mqttSubscribeToAll()
  } else if (!threejsApp.value)
    threejsApp.value = new ThreejsApp({
      canvas: canvas.value,
      mqttClient: mqttClient.value,
    })
}

mqttClient.value.onConnectionLost = () => {
  console.log("MQTT disconnected")
  mqttReconnecting.value = true
}
</script>
