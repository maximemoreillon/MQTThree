import * as THREE from "three"

class DebugPlane {
  params: any
  plane: THREE.Plane
  raycaster: THREE.Raycaster
  marker: THREE.Mesh
  spriteMaterial: THREE.SpriteMaterial
  sprite: THREE.Sprite

  constructor(params: any) {
    // TThis does not seem ideal
    this.params = params

    const { scene, renderer } = this.params

    this.raycaster = new THREE.Raycaster()

    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0))

    const markerGeometry = new THREE.SphereGeometry(0.1, 100, 100)
    const markerMaterial = new THREE.MeshBasicMaterial({ color: "#c00000" })
    this.marker = new THREE.Mesh(markerGeometry, markerMaterial)

    scene.add(this.marker)

    renderer.domElement.addEventListener("click", this.onMouseMove)

    const map = this.generateTextureMapWithText("--")

    this.spriteMaterial = new THREE.SpriteMaterial({ map })
    this.sprite = new THREE.Sprite(this.spriteMaterial)
    scene.add(this.sprite)
  }

  onMouseMove = ({ clientX, clientY }: MouseEvent) => {
    const mouse = new THREE.Vector2()

    const { renderer, camera } = this.params
    const { clientWidth, clientHeight } = renderer.domElement

    mouse.set(
      (clientX / clientWidth) * 2 - 1,
      -(clientY / clientHeight) * 2 + 1
    )

    this.raycaster.setFromCamera(mouse, camera)

    const intersectPosition = new THREE.Vector3()

    this.raycaster.ray.intersectPlane(this.plane, intersectPosition)

    this.marker.position.copy(intersectPosition)
    this.sprite.position.copy(intersectPosition)
    this.sprite.position.y = 1

    this.spriteMaterial.map = this.generateTextureMapWithText(
      `${Math.round(100 * intersectPosition.x) / 100} : ${
        Math.round(100 * intersectPosition.z) / 100
      }`
    )
  }

  generateTextureMapWithText(text: string) {
    //create image
    const canvas = document.createElement("canvas")
    canvas.width = 500
    canvas.height = 500
    const fontSize = 50
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
}

export default DebugPlane
