import * as THREE from "three"
import type { Client } from "paho-mqtt"
import ThreejsApp from "./ThreejsApp"
// import { Message } from "paho-mqtt"
// Nuxt instance not available
// const mqtt = useMqtt()

// TODO: have a proper event handler

class Device {
  app: ThreejsApp

  // TODO: consider if here or in children
  topic: string

  // TODO: mqttClient as second parameter
  constructor(app: ThreejsApp, opts: any) {
    this.app = app
    const { topic } = opts
    this.topic = topic
  }
  stateUpdate = (newState: any) => {}
  onClicked = () => {}
  animate = () => {}
}

export default Device
