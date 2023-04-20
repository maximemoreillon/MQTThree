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
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { v4 as uuidv4 } from "uuid"

import Device from "~/utils/Device"

// Create the MQTT client
const mqtt = useMqtt()
const runtimeConfig = useRuntimeConfig()
const { mqttHost, mqttPort } = runtimeConfig.public
mqtt.value = new MQTT.Client(mqttHost, Number(mqttPort), "/", uuidv4())

const canvas = ref()

let devices: Device[] = []

// Getting devices from .yml file
try {
  const response = await fetch("/config/config.yml")
  const data = await response.text()
  devices = YAML.parse(data).map(
    ({ topic, position, commandTopic }: any) =>
      new Device({ topic, position, commandTopic })
  )
} catch (error) {
  console.warn("Config file not found or invalid")
}

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
    if (state.toLowerCase() === "off") {
      foundDevice.light.intensity = 0
      foundDevice.material.color.set("#5c5400")
    } else if (state.toLowerCase() === "on") {
      foundDevice.material.color.set("#ffea00")
      foundDevice.light.intensity = 1
    }
  } catch (error) {
    console.warn(error)
  }
}

mqtt.value.onConnectionLost = (responseObject: any) => {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage)
  }
}

onMounted(async () => {
  const scene = new THREE.Scene()

  // TODO: not adapting to window size but canvas size
  // const { offsetWidth: width, offsetHeight: height } = canvas.value.parentNode
  const { innerWidth: width, innerHeight: height } = window

  canvas.value.width = width
  canvas.value.height = height

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    // antialias: true,
  })

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  const controls = new OrbitControls(camera, renderer.domElement)

  camera.position.set(5, 5, 5)

  const light = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(light)

  devices.forEach(({ mesh, light }: any) => {
    scene.add(mesh)
    scene.add(light)
  })

  const loader = new GLTFLoader()
  loader.load(
    "/model/model",
    function (gltf: any) {
      scene.add(gltf.scene)
    },
    // called while loading is progressing
    function (xhr: any) {
      // console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
    },
    // called when loading has errors
    function (error: any) {
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

    raycaster.setFromCamera(pointer, camera)

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true)

    const foundDevice: any = devices.find(({ mesh }: any) =>
      intersects.find(({ object }) => mesh === object)
    )

    if (!foundDevice) return
    const { commandTopic } = foundDevice
    if (!commandTopic) return

    // TODO: would be nicer to have a method in the Device class
    const message = new MQTT.Message(JSON.stringify({ state: "toggle" }))
    message.destinationName = commandTopic
    mqtt.value.send(message)
  }

  renderer.domElement.addEventListener("click", onRendererClicked)

  window.addEventListener(
    "resize",
    () => {
      // const { offsetWidth: width, offsetHeight: height } = canvas.value.parentNode
      const { innerWidth: width, innerHeight: height } = window
      canvas.value.width = width
      canvas.value.height = height
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    },
    false
  )

  function animate() {
    requestAnimationFrame(animate)
    controls.update()

    renderer.render(scene, camera)
  }
  animate()
})
</script>
