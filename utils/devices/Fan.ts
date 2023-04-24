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

class Fan extends ToggleableDevice {
  constructor(app: ThreejsApp, params: Params) {
    super(app, params)
    this.loadModel()
  }

  loadModel = () => {
    const loader = new GLTFLoader()
    loader.load(
      "/models/fan.glb",
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
    this.model.rotateY(0.5 * Math.PI)
    this.group.add(this.model)
    this.model.traverse(({ material }: any) => {
      if (material) material.color.set("#a5d1c0")
    })
  }

  onModelLoading = (xhr: any) => {
    // console.log(xhr)
  }

  onModelError = (error: any) => {
    console.error(error)
  }

  animate = () => {
    if (this.state === (this.params?.payload?.on || "on")) {
      this.model.rotateZ(0.1)
    }
  }
}

export default Fan
