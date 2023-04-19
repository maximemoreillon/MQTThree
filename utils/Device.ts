import * as THREE from "three"

class Device {
  topic: string
  material: THREE.MeshBasicMaterial
  mesh: THREE.Mesh
  light: THREE.PointLight
  state: string

  constructor(opts: any) {
    const {
      topic,
      position: { x = 0, y = 0, z = 0 },
    } = opts

    this.topic = topic
    const geometry = new THREE.SphereGeometry(0.15, 100, 100)
    this.material = new THREE.MeshBasicMaterial({ color: "#ffea00" })
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.set(x, y, z)

    this.light = new THREE.PointLight(0xffffff, 1, 100)
    this.light.castShadow = true
    this.light.position.set(x, y, z)

    this.state = "off"
  }

  onClicked() {
    console.log("I have been clicked")
  }
}

export default Device
