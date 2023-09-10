// TODO: consider having an event dispatcher

import { writable } from 'svelte/store';
import MQTT from 'paho-mqtt';

const eventHandlers: {event: string, callback: Function}[] = []

const {
  VITE_PUBLIC_MQTT_HOST,
  VITE_PUBLIC_MQTT_PORT,
  VITE_PUBLIC_MQTT_USE_SSL
} = import.meta.env;


// TODO: figure out if client really needs to be a writable

export let client:  MQTT.Client 
export const connected = writable(false)

export function init(){

  client = new MQTT.Client(
    VITE_PUBLIC_MQTT_HOST,
    Number(VITE_PUBLIC_MQTT_PORT),
    "/"
  )

  client.onMessageArrived = (message: MQTT.Message) => {
    // TODO: filter only for "message" handlers
    eventHandlers
    .filter(({event}: any) => event === 'message')
    .forEach(({callback}:any) => callback(message))
  }

  console.log('Client init OK')

  const userName = localStorage.getItem("userName")
  const password = localStorage.getItem("password")
  if( userName && password && !client.isConnected()) login(userName, password)
}

export function on (event: string, callback: Function) {
  eventHandlers.push({event, callback})
}


function onFailure(error: MQTT.ErrorWithInvocationContext) {
  console.error(error);
}

function onSuccess() {
  console.log("MQTT connected");
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