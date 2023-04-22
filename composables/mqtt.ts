// A store to hold the MQTT client
export const useMqttClient = () => useState<any>("mqtt", () => null)
export const useMqttReconnecting = () =>
  useState<any>("mqttReconnecting", () => false)
