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
  group: THREE.Group
  light: THREE.PointLight
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

    this.light = new THREE.PointLight(0xffffff, 0, 100, 20)
    this.light.castShadow = true

    // TODO: consider a dedicated method so as to benefit from inheritence
    this.group.add(this.light)

    this.state = "unknown"

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
    const scale = 0.01
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

  onClicked = () => {
    // would be simpler with just "toggle" as this.state would not be needed
    const state = this.state === "on" ? "off" : "on"
    const message = new MQTT.Message(JSON.stringify({ state }))
    message.destinationName = this.params.commandTopic
    this.app.mqttClient.send(message)
    this.model.material
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

export default Light
