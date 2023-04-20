<template>
  <LoginDialog />
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import * as YAML from "yaml"
import * as MQTT from "paho-mqtt"
import * as THREE from "three"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
// @ts-ignore
import { v4 as uuidv4 } from "uuid"

import Device from "~/utils/Device"

// Create the MQTT client
const mqtt = useMqtt()
const runtimeConfig = useRuntimeConfig()
const { mqttHost, mqttPort } = runtimeConfig.public
mqtt.value = new MQTT.Client(mqttHost, Number(mqttPort), "/", uuidv4())

const canvas = ref()

let devices: any[] = []

mqtt.value.onConnected = () => {
  devices.forEach(({ topic }: any) => {
    mqtt.value.subscribe(topic)
  })
}

mqtt.value.onMessageArrived = (message: any) => {
  try {
    const { payloadString, topic } = message
    const foundDevice: any = devices.find(
      (device: Device) => device.topic === topic
    )
    if (!foundDevice) return
    const { state } = JSON.parse(payloadString)
    foundDevice.stateUpdate(state)
  } catch (error) {
    console.warn(error)
  }
}

mqtt.value.onConnectionLost = (responseObject: any) => {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage)
  }
}

// TODO: think of
onMounted(async () => {
  // TODO: not adapting to window size but canvas size
  // const { offsetWidth: width, offsetHeight: height } = canvas.value.parentNode
  const { innerWidth: width, innerHeight: height } = window
  canvas.value.width = width
  canvas.value.height = height

  const threejsApp = new ThreejsApp(canvas.value)

  // Getting devices from .yml file
  try {
    const response = await fetch("/config/config.yml")
    const data = await response.text()

    // FIXME: this needs to move into onMounted and scene must be passed
    devices = YAML.parse(data).map(
      ({ topic, position, commandTopic }: any) =>
        new Light({
          topic,
          position,
          commandTopic,
          mqttClient: mqtt.value,
          scene: threejsApp.scene,
        })
    )
  } catch (error) {
    console.warn("Config file not found or invalid")
  }

  const loader = new GLTFLoader()
  loader.load(
    "/model/model",
    (gltf: any) => {
      threejsApp.scene.add(gltf.scene)
    },
    // called while loading is progressing
    (xhr: any) => {
      // TODO: show in a dialog
      // console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
    },
    // called when loading has errors
    (error: any) => {
      console.error(error)
    }
  )

  // Click events
  const raycaster = new THREE.Raycaster()
  function onRendererClicked({ clientX, clientY }: any) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    const pointer = new THREE.Vector2()
    pointer.x = (clientX / window.innerWidth) * 2 - 1
    pointer.y = -(clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(pointer, threejsApp.camera)

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(
      threejsApp.scene.children,
      true
    )

    const foundDevice: any = devices.find(({ mesh }: any) =>
      intersects.find(({ object }) => mesh === object)
    )

    if (!foundDevice) return
    foundDevice.onClicked()
  }

  threejsApp.renderer.domElement.addEventListener("click", onRendererClicked)
})
</script>
