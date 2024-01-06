<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos"

const emit = defineEmits(["loadStart", "loadProgress", "loadEnd", "loadError"])

const { scene: model } = await useGLTF(
  "/api/model",
  { draco: true },
  ({ manager }) => {
    manager.onStart = () => emit("loadStart")
    manager.onProgress = (e) => emit("loadProgress", e)
    manager.onLoad = () => emit("loadEnd")
    manager.onError = () => emit("loadError")
  }
)
</script>

<template>
  <primitive :object="model" />
</template>
