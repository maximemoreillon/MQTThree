import * as THREE from "three"
import Device from "./Device"

class Sensor extends Device {
  key: string
  spriteMaterial: THREE.SpriteMaterial

  constructor(opts: any) {
    const {
      position: { x = 0, y = 0, z = 0 },
      key,
    } = opts

    super(opts)

    this.key = key

    const geometry = new THREE.SphereGeometry(0.15, 100, 100)
    const material = new THREE.MeshBasicMaterial({ color: "#00ff00" })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z)
    this.scene.add(mesh)

    const text = "--"

    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    const fontSize = 20
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.font = `Bold ${fontSize}px Arial`

      ctx.fillStyle = "green"
      ctx.fillRect(
        0.25 * canvas.width,
        0.5 * canvas.height - fontSize,
        0.5 * canvas.width,
        2 * fontSize
      )
      ctx.beginPath()
      ctx.textAlign = "center"
      ctx.fillStyle = "white"
      ctx.fillText(
        text,
        0.5 * canvas.width,
        0.5 * canvas.height + 0.5 * fontSize
      )
    }

    const map = new THREE.TextureLoader().load(canvas.toDataURL("image/png"))

    this.spriteMaterial = new THREE.SpriteMaterial({ map })

    const sprite = new THREE.Sprite(this.spriteMaterial)
    sprite.position.set(x, y + 0.3, z)
    this.scene.add(sprite)
  }

  onClicked() {
    console.log("Sensor clicked")
  }

  stateUpdate(payload: any): void {
    const value = payload[this.key]

    const text = value
    //create image
    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    const fontSize = 20
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.font = `Bold ${fontSize}px Arial`

    ctx.fillStyle = "green"
    ctx.fillRect(
      0.25 * canvas.width,
      0.5 * canvas.height - fontSize,
      0.5 * canvas.width,
      2 * fontSize
    )
    ctx.beginPath()
    ctx.textAlign = "center"
    ctx.fillStyle = "white"
    ctx.fillText(text, 0.5 * canvas.width, 0.5 * canvas.height + 0.5 * fontSize)

    const map = new THREE.TextureLoader().load(canvas.toDataURL("image/png"))

    this.spriteMaterial.map = map
  }
}

export default Sensor
