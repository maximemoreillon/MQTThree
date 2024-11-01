import {env} from '$env/dynamic/public'


export const {
  PUBLIC_MQTT_HOST = "localhost",
  PUBLIC_MQTT_PORT = "9001",
  PUBLIC_MQTT_USE_SSL
} = env;


export const configDir = './config'
export const modelFileName = 'model.glb'
export const devicesFileName = 'devices.yml'