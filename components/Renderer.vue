<template>
  <LoginDialog :visible="false" />
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import * as YAML from "yaml"
import * as THREE from "three"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import * as MQTT from "paho-mqtt"

const runtimeConfig = useRuntimeConfig()

const { mqttHost, mqttPort } = runtimeConfig.public

const mqttClient = new MQTT.Client(mqttHost, Number(mqttPort), "/", "paho")

const canvas = ref()
onMounted(async () => {
  const response = await fetch("/config/config.yml")
  const data = await response.text()
  const devices = YAML.parse(data).map(
    ({ topic, position }: any) => new Device({ topic, position })
  )

  const scene = new THREE.Scene()

  // TODO: not adapting to window size but canvas size
  // const { offsetWidth: width, offsetHeight: height } = canvas.value.parentNode
  const { innerWidth: width, innerHeight: height } = window

  canvas.value.width = width
  canvas.value.height = height

  const renderer = new THREE.WebGLRenderer({ canvas: canvas.value })
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  const controls = new OrbitControls(camera, renderer.domElement)

  camera.position.set(5, 5, 5)

  const light = new THREE.AmbientLight(0xffffff, 1)
  scene.add(light)

  devices.forEach(({ mesh }: any) => {
    scene.add(mesh)
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

    const foundDevice = devices.find(({ mesh }: any) =>
      intersects.find(({ object }) => mesh === object)
    )

    if (!foundDevice) return
    foundDevice.onClicked()
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
