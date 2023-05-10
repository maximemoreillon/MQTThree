import * as THREE from "three"
import Device from "../Device"
import ThreejsApp from "../ThreejsApp"
import MQTT from "paho-mqtt"

interface Params {
  position: {
    x: number
    y: number
    z: number
  }
  rotation?: {
    x: number
    y: number
    z: number
  }
  commandTopic: string
  payload?: {
    on: string
    off: string
  }
}

export default class ToggleableDevice extends Device {
  group: THREE.Group
  state: string
  hitbox: THREE.Mesh
  model: THREE.Mesh
  params: Params

  constructor(app: ThreejsApp, params: Params) {
    super(app, params)

    this.params = params
    const { position, rotation } = this.params

    this.group = new THREE.Group()
    this.group.position.set(position.x, position.y, position.z)
    this.group.rotation.z = (Math.PI * (rotation?.z || 0)) / 180
    this.group.rotation.y = (Math.PI * (rotation?.y || 0)) / 180
    this.group.rotation.x = (Math.PI * (rotation?.x || 0)) / 180

    this.app.scene.add(this.group)

    this.model = new THREE.Mesh()
    const geometry = new THREE.SphereGeometry(0.15, 100, 100)
    this.hitbox = new THREE.Mesh(geometry)
    this.hitbox.visible = false

    this.group.add(this.hitbox)

    this.state = "unknown"
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
}
