import { writable } from 'svelte/store';
import MQTT from 'paho-mqtt';
import { v4 as uuidv4 } from 'uuid';

const eventHandlers: {event: string, callback: Function}[] = []

const {
  VITE_PUBLIC_MQTT_HOST = "localhost",
  VITE_PUBLIC_MQTT_PORT = "1883",
  VITE_PUBLIC_MQTT_USE_SSL
} = import.meta.env;


export let client:  MQTT.Client 
export const connected = writable(false)

export function init(){

  client = new MQTT.Client(
    VITE_PUBLIC_MQTT_HOST,
    Number(VITE_PUBLIC_MQTT_PORT),
    "/",
    uuidv4()
  )

  client.onMessageArrived = handleMessage
  client.onConnectionLost = handleConnectionLost

  const userName = localStorage.getItem("userName")
  const password = localStorage.getItem("password")
  if( userName && password && !client.isConnected()) login(userName, password)
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
    useSSL: !!VITE_PUBLIC_MQTT_USE_SSL,
    keepAliveInterval: 30,
    reconnect: true,
  };

  client.connect(connectionOptions);

  // Not secure but will do for testing
  localStorage.setItem("userName", userName)
  localStorage.setItem("password", password)
}