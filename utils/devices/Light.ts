import * as THREE from "three"
import Device from "../Device"
import MQTT from "paho-mqtt"
import ThreejsApp from "../ThreejsApp"

// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

interface Params {
  position: any
  commandTopic: string
}

class Light extends Device {
  light: THREE.PointLight
  mesh: THREE.Mesh
  material: THREE.MeshBasicMaterial
  state: string
  params: Params

  constructor(app: ThreejsApp, params: Params) {
    super(app, params)

    this.params = params
    const { x, y, z } = this.params.position

    const geometry = new THREE.SphereGeometry(0.15, 100, 100)
    this.material = new THREE.MeshBasicMaterial({ color: "#444444" })
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.set(x, y, z)

    this.light = new THREE.PointLight(0xffffff, 0, 100, 20)
    this.light.castShadow = true
    this.light.position.set(x, y, z)

    // TODO: consider a dedicated method so as to benefit from inheritence
    this.app.scene.add(this.mesh)
    this.app.scene.add(this.light)

    this.state = "unknown"

    // this.loadModel()
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
    const { x, y, z } = this.params.position
    this.mesh = model.scene
    this.mesh.scale.set(0.02, 0.02, 0.02)
    this.app.scene.add(this.mesh)
    this.mesh.position.set(x, y, z)
  }

  onModelLoading = (xhr: any) => {
    // console.log(xhr)
  }

  onModelError = (error: any) => {
    console.error(error)
  }

  onClicked = () => {
    console.log("Clicked")
    // would be simpler with just "toggle" as this.state would not be needed
    const state = this.state === "on" ? "off" : "on"
    const message = new MQTT.Message(JSON.stringify({ state }))
    message.destinationName = this.params.commandTopic
    this.app.mqttClient.send(message)
  }

  stateUpdate = ({ state }: any): void => {
    this.state = state.toLowerCase()
    if (this.state === "off") {
      this.light.intensity = 0
      this.material.color.set("#5c5400")
    } else if (this.state === "on") {
      this.material.color.set("#ffea00")
      this.light.intensity = 1
    }
  }
}

export default Light
