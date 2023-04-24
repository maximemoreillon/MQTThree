import * as THREE from "three"
import Device from "../Device"
import MQTT from "paho-mqtt"
import ThreejsApp from "../ThreejsApp"

// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

interface Params {
  position: any
  commandTopic: string
  payload?: {
    on: string
    off: string
  }
}

class Fan extends Device {
  group: THREE.Group
  hitbox: THREE.Mesh
  model: THREE.Mesh
  // material: THREE.MeshBasicMaterial
  state: string
  params: Params

  constructor(app: ThreejsApp, params: Params) {
    super(app, params)

    this.params = params
    const { x, y, z } = this.params.position

    this.group = new THREE.Group()
    this.group.position.set(x, y, z)
    this.app.scene.add(this.group)

    this.model = new THREE.Mesh()
    const geometry = new THREE.SphereGeometry(0.15, 100, 100)
    this.hitbox = new THREE.Mesh(geometry)
    this.hitbox.visible = false

    this.group.add(this.hitbox)

    this.state = "unknown"

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
  }

  onModelLoading = (xhr: any) => {
    // console.log(xhr)
  }

  onModelError = (error: any) => {
    console.error(error)
  }

  onClicked = () => {
    // would be simpler with just "toggle" as this.state would not be needed
    const payload = {
      off: this.params?.payload?.off || "off",
      on: this.params?.payload?.on || "on",
    }

    const state = this.state === payload.on ? payload.off : payload.on
    const message = new MQTT.Message(JSON.stringify({ state }))
    message.destinationName = this.params.commandTopic
    this.app.mqttClient.send(message)
    this.model.material
  }

  stateUpdate = ({ state }: any): void => {
    this.state = state.toLowerCase()
  }

  animate = () => {
    if (this.state === (this.params?.payload?.on || "on")) {
      this.model.rotateZ(0.1)
    }
  }
}

export default Fan
