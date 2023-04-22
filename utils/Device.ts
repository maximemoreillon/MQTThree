import * as THREE from "three"
import type { Client } from "paho-mqtt"

// import { Message } from "paho-mqtt"
// Nuxt instance not available
// const mqtt = useMqtt()

class Device {
  topic: string // TODO: consider if here or in children
  scene: THREE.Scene

  mqttClient: Client

  constructor(opts: any) {
    const {
      topic,
      position: { x = 0, y = 0, z = 0 },
      mqttClient,
      scene,
    } = opts

    this.topic = topic
    this.scene = scene

    this.mqttClient = mqttClient
    // Not ideal to MQTTT Subscribe here because MQTT might not be connected
    mqttClient.subscribe(this.topic)
  }
  stateUpdate = (newState: any) => {}
  onClicked = () => {}
}

export default Device
