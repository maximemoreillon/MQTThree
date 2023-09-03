// TODO: consider having an event dispatcher

import { writable } from 'svelte/store';
import MQTT from 'paho-mqtt';

const eventHandlers: {event: string, callback: Function}[] = []

const {
  VITE_PUBLIC_MQTT_HOST,
  VITE_PUBLIC_MQTT_PORT,
} = import.meta.env;


// TODO: figure out if client really needs to be a writable

export const client = writable<MQTT.Client>()
export const connected = writable(false)

export function init(){

  const newClient = new MQTT.Client(
    VITE_PUBLIC_MQTT_HOST,
    Number(VITE_PUBLIC_MQTT_PORT),
    "/"
  )

  newClient.onMessageArrived = (message: MQTT.Message) => {
    // TODO: filter only for "message" handlers
    eventHandlers
    .filter(({event}: any) => event === 'message')
    .forEach(({callback}:any) => callback(message))
  }

  client.set(newClient)

  console.log('Client init OK')


}

export function on (event: string, callback: Function) {
  eventHandlers.push({event, callback})
}