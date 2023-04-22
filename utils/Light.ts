import * as THREE from "three"
import Device from "./Device"
import MQTT from "paho-mqtt"

class Light extends Device {
  commandTopic: string
  light: THREE.PointLight
  mesh: THREE.Mesh
  material: THREE.MeshBasicMaterial
  state: string
  // IDEA: have MQTT client attribute

  constructor(opts: any) {
    const {
      position: { x = 0, y = 0, z = 0 },
      commandTopic,
    } = opts

    super(opts)

    this.commandTopic = commandTopic

    // TODO: consider having those in children because each one should have its
    const geometry = new THREE.SphereGeometry(0.15, 100, 100)
    this.material = new THREE.MeshBasicMaterial({ color: "#444444" })
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.set(x, y, z)

    this.light = new THREE.PointLight(0xffffff, 0, 100, 20)
    this.light.castShadow = true
    this.light.position.set(x, y, z)

    // TODO: consider a dedicated method so as to benefit from inheritence
    this.scene.add(this.mesh)
    this.scene.add(this.light)

    this.state = "unknown"
  }

  onClicked = () => {
    // TODO: would be simpler with just "toggle" as this.state would not be needed
    const state = this.state === "on" ? "off" : "on"
    const message = new MQTT.Message(JSON.stringify({ state }))
    message.destinationName = this.commandTopic
    this.mqttClient.send(message)
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
