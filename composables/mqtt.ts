// A store to hold the MQTT client
export const useMqtt = () => useState<any>("mqtt", () => null)
