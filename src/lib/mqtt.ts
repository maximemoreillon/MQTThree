import { writable } from 'svelte/store';
import MQTT from 'paho-mqtt';
import { v4 as uuidv4 } from 'uuid';
import {env} from '$env/dynamic/public'
import axios from 'axios'
const eventHandlers: {event: string, callback: Function}[] = []

const {
  PUBLIC_MQTT_HOST = "localhost",
  PUBLIC_MQTT_PORT = "9001",
  PUBLIC_MQTT_USE_SSL
} = env;


export let client:  MQTT.Client 
export const connected = writable(false)

export function init(){

  client = new MQTT.Client(
    PUBLIC_MQTT_HOST,
    Number(PUBLIC_MQTT_PORT),
    "/",
    uuidv4()
  )

  client.onMessageArrived = handleMessage
  client.onConnectionLost = handleConnectionLost
}

export function on (event: string, callback: Function) {
  eventHandlers.push({event, callback})
}

function handleMessage  (message: MQTT.Message) {
  eventHandlers
  .filter(({event}: any) => event === 'message')
  .forEach(({callback}:any) => callback(message))
}

function handleConnectionLost(){
  connected.set(false)
}

function onFailure(error: MQTT.ErrorWithInvocationContext) {
  console.error(error);
  connected.set(false)
}

function onSuccess() {
  // TODO: check if reconnection
  connected.set(true)
  eventHandlers
    .filter(({event}: any) => event === 'connected')
    .forEach(({callback}:any) => callback())
}

export function login(userName: string, password: string) {
  const connectionOptions = {
    onSuccess,
    onFailure,
    userName,
    password,
    useSSL: !!PUBLIC_MQTT_USE_SSL,
    keepAliveInterval: 30,
    reconnect: true,
  };

  client.connect(connectionOptions);

}