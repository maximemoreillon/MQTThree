import * as MQTT from "paho-mqtt"

const NUXT_MQTT_HOST = "mqtt.home.maximemoreillon.com"
const NUXT_MQTT_PORT = 443

export const useMqtt = () =>
  useState<any>(
    "mqtt",
    () => new MQTT.Client(NUXT_MQTT_HOST, Number(NUXT_MQTT_PORT), "/", "paho")
  )
