<template>
  <!-- <LoginDialog /> -->
  <ModelUploadDialog />
  <MqttReconnectingDialog />
  <TresCanvas>
    <TresPerspectiveCamera :position="[5, 5, 5]" :look-at="[0, 0, 0]" />
    <OrbitControls />
    <Suspense>
      <!-- This could emit the loading progress -->
      <WorldModel @load-progress="(e) => console.log(e)" />
    </Suspense>
    <TresAmbientLight :intensity="0.5" />
  </TresCanvas>
</template>

<script setup lang="ts">
import MQTT from "paho-mqtt"

import { v4 as uuidv4 } from "uuid"

// Create the MQTT client
// Needs to be created here because if done in utils, getting a Nuxt instance not found or MQTT not supported in this browser
const mqttClient = useMqttClient()
const mqttReconnecting = useMqttReconnecting()

const runtimeConfig = useRuntimeConfig()
const { mqttHost, mqttPort } = runtimeConfig.public

console.log(`Creating an MQTT client with host ${mqttHost}`)
mqttClient.value = new MQTT.Client(mqttHost, Number(mqttPort), "/", uuidv4())

onMounted(() => {})

mqttClient.value.onConnected = (reconnect: boolean) => {
  if (reconnect) {
    mqttReconnecting.value = false
  }
}

mqttClient.value.onConnectionLost = () => {
  console.log("MQTT disconnected")
  mqttReconnecting.value = true
}
</script>
