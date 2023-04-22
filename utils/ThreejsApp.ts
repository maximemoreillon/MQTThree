import * as THREE from "three"
import * as YAML from "yaml"
import MQTT from "paho-mqtt"

// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

import Light from "./Light"
import Sensor from "./Sensor"

import DebugPlane from "./DebugPlane"

class ThreejsApp {
  // TODO: consider a MQTT Handler class
  mqttClient: MQTT.Client

  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  controls: OrbitControls

  gridHelper: THREE.GridHelper
  axesHelper: THREE.AxesHelper

  raycaster: THREE.Raycaster

  devices: (Light | Sensor)[]

  constructor({ canvas, mqttClient }: any) {
    const { innerWidth: width, innerHeight: height } = window

    this.mqttClient = mqttClient

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color("#444444")
    this.renderer = new THREE.WebGLRenderer({ canvas })

    // TODO: Find better way to deal with raycaster
    this.raycaster = new THREE.Raycaster()

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.camera.position.set(5, 5, 5)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.devices = []

    this.animate()

    window.addEventListener("resize", this.onWindowResized, false)

    // Raycaster stuff
    this.renderer.domElement.addEventListener("click", this.onRendererClicked)

    // Respond handle MQTT messages
    mqttClient.onMessageArrived = this.onMqttMessageArrived

    this.loadModel()
    this.getDevicesFromYaml()

    // Grid helper
    // TODO: connect to settings
    const size = 10
    const divisions = 10
    this.gridHelper = new THREE.GridHelper(size, divisions)
    this.axesHelper = new THREE.AxesHelper(5)
  }

  toggleGrid = () => {
    if (this.gridHelper.parent) this.gridHelper.removeFromParent()
    else this.scene.add(this.gridHelper)

    if (this.axesHelper.parent) this.axesHelper.removeFromParent()
    else this.scene.add(this.axesHelper)
  }

  onMqttMessageArrived = ({ topic, payloadString }: any) => {
    const foundDevice: any = this.devices.find(
      (device: any) => device.topic === topic
    )
    if (!foundDevice) return
    try {
      const payloadJson = JSON.parse(payloadString)
      foundDevice.stateUpdate(payloadJson)
    } catch (error) {
      console.warn(error)
    }
  }

  getDevicesFromYaml = async () => {
    try {
      const response = await fetch("/api/config")
      const data = await response.text()

      this.devices = YAML.parse(data)
        .map(({ type, ...properties }: any) => {
          if (type === "light")
            return new Light({
              ...properties,
              mqttClient: this.mqttClient,
              scene: this.scene,
            })
          else if (type === "sensor")
            return new Sensor({
              ...properties,
              mqttClient: this.mqttClient,
              scene: this.scene,
            })
        })
        .filter((d: any) => d)

      const ambientLightIntensity = this.devices.some(
        (d): d is Light => d instanceof Light
      )
        ? 0.3
        : 1

      const ambientLight = new THREE.AmbientLight(
        0xffffff,
        ambientLightIntensity
      )
      this.scene.add(ambientLight)
    } catch (error) {
      console.error(error)
    }
  }

  loadModel = () => {
    new GLTFLoader().load(
      "/api/model",
      (gltf: any) => {
        this.scene.add(gltf.scene)
        this.onModelLoaded()
      },
      this.onModelLoading,
      (error: any) => {
        console.error(error)
        // TODO: have a
        this.onModelLoaded()
      }
    )
  }

  onModelLoading = (xhr: any) => {
    // Nothing as overridden
    // TODO: does not feel like the right option
  }

  onModelLoaded = () => {
    // Nothing as overridden
    // TODO: does not feel like the right option
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

  onRendererClicked = ({ clientX, clientY }: any) => {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    const pointer = new THREE.Vector2()
    pointer.x = (clientX / window.innerWidth) * 2 - 1
    pointer.y = -(clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(pointer, this.camera)

    // calculate objects intersecting the picking ray
    const objects = this.devices
      .filter((d): d is Light => d instanceof Light)
      .map((d) => d.mesh)

    const [intersect] = this.raycaster.intersectObjects(objects, true)
    if (!intersect) return

    const foundDevice: any = this.devices.find(
      ({ mesh }: any) => mesh === intersect.object
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
