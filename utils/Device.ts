import * as THREE from "three"
import type { Client } from "paho-mqtt"

// import { Message } from "paho-mqtt"

// Nuxt instance not available
// const mqtt = useMqtt()

class Device {
  topic: string // TODO: consider if here or in children
  scene: THREE.Scene
  mesh: THREE.Mesh
  material: THREE.MeshBasicMaterial
  mqttClient: Client

  constructor(opts: any) {
    const {
      topic,
      position: { x = 0, y = 0, z = 0 },
      mqttClient,
      scene,
    } = opts

    this.topic = topic
    this.scene = scene

    // TODO: consider having those in children because each one should have its
    const geometry = new THREE.SphereGeometry(0.15, 100, 100)
    this.material = new THREE.MeshBasicMaterial({ color: "#444444" })
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.set(x, y, z)

    this.mqttClient = mqttClient
    mqttClient.subscribe(this.topic)

    // IDEA could have MQTT listener here, but would make a lot of listeners
    // mqttClient.onMessageArrived = ({ topic }: any) => {
    //   if (topic === this.topic) console.log(this.topic)
    // }
  }
  stateUpdate(newState: any) {
    console.log(newState)
  }
  onClicked() {
    console.log("Clicked")
  }
}

export default Device
