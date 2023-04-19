<template>
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import * as THREE from "three"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

const canvas = ref()

onMounted(() => {
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

  const loader = new GLTFLoader()
  loader.load(
    "/model/model",
    function (gltf: any) {
      scene.add(gltf.scene)
    },
    // called while loading is progressing
    function (xhr: any) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
    },
    // called when loading has errors
    function (error: any) {
      console.error(error)
    }
  )

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
