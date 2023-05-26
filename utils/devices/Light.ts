import * as THREE from "three"
import ToggleableDevice from "./ToggleableDevice"
import ThreejsApp from "../ThreejsApp"

// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

// this is quite rubbish
interface Params {
  position: any
  commandTopic: string
  payload?: {
    on: string
    off: string
  }
}

export default class Light extends ToggleableDevice {
  light: THREE.PointLight

  constructor(app: ThreejsApp, params: Params) {
    super(app, params)
    this.light = new THREE.PointLight(0xffffff, 0, 100, 20)
    this.light.castShadow = true
    this.group.add(this.light)
    this.loadModel()
  }

  loadModel = () => {
    const loader = new GLTFLoader()
    loader.load(
      "/models/light.glb",
      this.onModelLoaded,
      this.onModelLoading,
      this.onModelError
    )
  }

  onModelLoaded = (model: any) => {
    this.model = model.scene
    this.model.castShadow = false
    this.model.receiveShadow = false
    const scale = 0.015
    this.model.scale.set(scale, scale, scale)
    this.model.position.z += scale * 24
    this.group.add(this.model)
    this.updateRepresentation()
  }

  onModelLoading = (xhr: any) => {
    // console.log(xhr)
  }

  onModelError = (error: any) => {
    console.error(error)
  }

  stateUpdate = ({ state }: any): void => {
    this.state = state.toLowerCase()
    this.updateRepresentation()
  }

  updateRepresentation() {
    if (this.state === "off") {
      this.light.intensity = 0
      this.model.traverse(({ material }: any) => {
        if (material) material.color.set("#222222")
      })
    } else if (this.state === "on") {
      this.model.traverse(({ material }: any) => {
        if (material) material.color.set("#ffff00")
      })
      this.light.intensity = 1
    } else {
      this.model.traverse(({ material }: any) => {
        if (material) material.color.set("#c00000")
      })
      this.light.intensity = 0
    }
  }
}
