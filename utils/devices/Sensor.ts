import * as THREE from "three"
import Device from "../Device"
import ThreejsApp from "../ThreejsApp"

class Sensor extends Device {
  key: string
  unit: string
  spriteMaterial: THREE.SpriteMaterial

  constructor(app: ThreejsApp, opts: any) {
    const {
      position: { x = 0, y = 0, z = 0 },
      key,
      unit = "",
    } = opts

    super(app, opts)

    this.key = key
    this.unit = unit

    const map = this.generateTextureMapWithText("--")

    this.spriteMaterial = new THREE.SpriteMaterial({ map })

    const sprite = new THREE.Sprite(this.spriteMaterial)
    sprite.position.set(x, y, z)
    this.app.scene.add(sprite)
  }

  generateTextureMapWithText(text: string) {
    //create image
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

    const imageUrl = canvas.toDataURL("image/png")
    return new THREE.TextureLoader().load(imageUrl)
  }

  stateUpdate = (payload: any): void => {
    const value = Math.round(payload[this.key])
    this.spriteMaterial.map = this.generateTextureMapWithText(
      `${value} ${this.unit}`
    )
  }
}

export default Sensor
