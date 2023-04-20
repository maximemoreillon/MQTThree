import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

class ThreejsApp {
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.Camera
  controls: OrbitControls

  constructor(canvas: HTMLElement) {
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({
      canvas,
    })

    const { innerWidth: width, innerHeight: height } = window

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.camera.position.set(5, 5, 5)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    this.scene.add(ambientLight)

    this.animate()

    window.addEventListener("resize", this.onWindowResized, false)
  }

  onWindowResized = () => {
    // TODO: resize according to canvas and not window
    const { innerWidth: width, innerHeight: height } = window
    this.renderer.domElement.width = width
    this.renderer.domElement.height = height
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}

export default ThreejsApp
