import * as THREE from "three"
import * as YAML from "yaml"
import { Client } from "paho-mqtt"

// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

import Light from "./Light"
import Sensor from "./Sensor"

class ThreejsApp {
  mqttClient: Client
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.Camera
  raycaster: THREE.Raycaster
  controls: OrbitControls

  devices: (Light | Sensor)[]

  constructor(canvas: HTMLElement, mqttClient: Client) {
    this.mqttClient = mqttClient
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({ canvas })
    this.raycaster = new THREE.Raycaster()

    const { innerWidth: width, innerHeight: height } = window

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.camera.position.set(5, 5, 5)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    this.scene.add(ambientLight)

    this.devices = []

    this.loadModel()
    this.getDevicesFromYaml()
    this.animate()

    window.addEventListener("resize", this.onWindowResized, false)
    this.renderer.domElement.addEventListener("click", this.onRendererClicked)

    mqttClient.onMessageArrived = ({ topic, payloadString }: any) => {
      try {
        const foundDevice: any = this.devices.find(
          (device: any) => device.topic === topic
        )
        if (!foundDevice) return
        const { state } = JSON.parse(payloadString)
        foundDevice.stateUpdate(state)
      } catch (error) {
        console.warn(error)
      }
    }
  }

  getDevicesFromYaml = async () => {
    // Getting devices from .yml file
    try {
      const response = await fetch("/config/config.yml")
      const data = await response.text()

      this.devices = YAML.parse(data).map(
        ({ type, topic, position, commandTopic }: any) => {
          if (type === "light")
            return new Light({
              topic,
              position,
              commandTopic,
              mqttClient: this.mqttClient,
              scene: this.scene,
            })
        }
      )
    } catch (error) {
      console.warn("Config file not found or invalid")
    }
  }

  loadModel = () => {
    new GLTFLoader().load(
      "/model/model",
      (gltf: any) => {
        this.scene.add(gltf.scene)
      },
      // called while loading is progressing
      (xhr: any) => {
        // TODO: show in a dialog
        // PROBLEM: no access to the Vue app anymore
        // console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
      },
      // called when loading has errors
      (error: any) => {
        console.error(error)
      }
    )
  }

  onWindowResized = () => {
    // TODO: resize according to canvas and not window
    const { innerWidth: width, innerHeight: height } = window
    this.renderer.domElement.width = width
    this.renderer.domElement.height = height
    // @ts-ignore
    this.camera.aspect = width / height
    // @ts-ignore
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  onRendererClicked = ({ clientX, clientY }: any) => {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    const pointer = new THREE.Vector2()
    pointer.x = (clientX / window.innerWidth) * 2 - 1
    pointer.y = -(clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(pointer, this.camera)

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    )

    const foundDevice: any = this.devices.find(({ mesh }: any) =>
      intersects.find(({ object }) => mesh === object)
    )

    if (!foundDevice) return
    foundDevice.onClicked()
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}

export default ThreejsApp
