import * as THREE from "three"
import * as YAML from "yaml"
import MQTT from "paho-mqtt"

// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

import Light from "./devices/Light"
import Sensor from "./devices/Sensor"
import Fan from "./devices/Fan"
import ToggleableDevice from "./devices/ToggleableDevice"
class ThreejsApp {
  // TODO: consider a MQTT Handler class
  mqttClient: MQTT.Client

  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  ambientLight: THREE.AmbientLight

  gridHelper: THREE.GridHelper
  axesHelper: THREE.AxesHelper

  raycaster: THREE.Raycaster

  devices: (Light | Sensor | Fan)[]

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

    // Ambient light is bright by default, unless there are toggle lights in the scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1)
    this.scene.add(this.ambientLight)

    this.devices = []

    this.animate()

    window.addEventListener("resize", this.onWindowResized, false)

    // Respond handle MQTT messages
    mqttClient.onMessageArrived = this.onMqttMessageArrived

    // Raycaster to click items
    this.renderer.domElement.addEventListener("click", this.onClicked)

    // Disabling click events when orbitcontrols are in use
    this.controls.addEventListener("start", () => {
      setTimeout(() => {
        this.renderer.domElement.removeEventListener("click", this.onClicked)
      }, 500)
    })

    this.controls.addEventListener("end", () => {
      setTimeout(() => {
        this.renderer.domElement.addEventListener("click", this.onClicked)
      }, 500)
    })

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

  toggle3d = () => {
    if (this.controls.enableRotate) {
      this.controls.saveState()
      this.controls.enableRotate = false
      this.camera.position.set(0, 10, 0)
      this.camera.lookAt(0, 0, 0)
    } else {
      this.controls.enableRotate = true
      this.controls.reset()
    }
  }

  toggleAmbientLight = () => {
    if (this.ambientLight.intensity === 0.3) this.ambientLight.intensity = 1
    else this.ambientLight.intensity = 0.3
  }

  onMqttMessageArrived = ({ topic, payloadString }: any) => {
    this.devices
      .filter((d: any) => d.topic === topic)
      .forEach((d) => {
        try {
          const payloadJson = JSON.parse(payloadString)
          d.stateUpdate(payloadJson)
        } catch (error) {
          console.warn(error)
        }
      })
  }

  getDevicesFromYaml = async () => {
    try {
      const response = await fetch("/api/config")
      const data = await response.text()

      this.devices = YAML.parse(data)
        .map(({ type, ...properties }: any) => {
          if (type === "light") return new Light(this, properties)
          else if (type === "sensor") return new Sensor(this, properties)
          else if (type === "fan") return new Fan(this, properties)
        })
        .filter((d: any) => d)

      const sceneHasLight = this.devices.some((d) => d instanceof Light)
      if (sceneHasLight) this.ambientLight.intensity = 0.3
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

  onClicked = ({ clientX, clientY }: any) => {
    const pointer = new THREE.Vector2()
    pointer.x = (clientX / window.innerWidth) * 2 - 1
    pointer.y = -(clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(pointer, this.camera)

    const objects = this.devices
      .filter((d): d is Light => d instanceof ToggleableDevice)
      .map((d) => d.hitbox)

    const intersects = this.raycaster.intersectObjects(objects, false)

    if (!intersects.length) return

    const foundDevice: any = this.devices.find(({ hitbox }: any) =>
      intersects.find(({ object }) => hitbox === object)
    )

    if (foundDevice) foundDevice.onClicked()
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.controls.update()
    this.devices.forEach((device) => device.animate())
    this.renderer.render(this.scene, this.camera)
  }
}

export default ThreejsApp
