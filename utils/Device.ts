import * as THREE from "three"
// import { Message } from "paho-mqtt"

// Nuxt instance not available
// const mqtt = useMqtt()

class Device {
  topic: string
  commandTopic?: string
  material: THREE.MeshBasicMaterial
  mesh: THREE.Mesh
  light: THREE.PointLight
  state: string

  constructor(opts: any) {
    const {
      topic,
      position: { x = 0, y = 0, z = 0 },
      commandTopic,
    } = opts

    this.topic = topic
    this.commandTopic = commandTopic

    const geometry = new THREE.SphereGeometry(0.15, 100, 100)
    this.material = new THREE.MeshBasicMaterial({ color: "#444444" })
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.set(x, y, z)

    this.light = new THREE.PointLight(0xffffff, 0, 100, 20)
    this.light.castShadow = true
    this.light.position.set(x, y, z)

    this.state = "unknown"
  }
}

export default Device
