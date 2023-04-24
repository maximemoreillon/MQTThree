import * as THREE from "three"
import type { Client } from "paho-mqtt"
import ThreejsApp from "./ThreejsApp"
// import { Message } from "paho-mqtt"
// Nuxt instance not available
// const mqtt = useMqtt()

class Device {
  app: ThreejsApp

  topic: string // TODO: consider if here or in children

  // TODO: mqttClient as second parameter
  constructor(app: ThreejsApp, opts: any) {
    this.app = app

    const { topic } = opts

    this.topic = topic

    app.mqttClient.subscribe(this.topic)
  }
  stateUpdate = (newState: any) => {}
  onClicked = () => {}
  animate = () => {}
}

export default Device
