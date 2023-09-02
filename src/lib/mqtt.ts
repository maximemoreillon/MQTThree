// TODO: consider having an event dispatcher

import { writable } from 'svelte/store';
import MQTT, { type ErrorWithInvocationContext } from 'paho-mqtt';

const {
  VITE_PUBLIC_MQTT_HOST,
  VITE_PUBLIC_MQTT_PORT,
  VITE_PUBLIC_MQTT_USE_SSL,
} = import.meta.env;


export const client = writable<MQTT.Client>()
export const connected = writable(false)

export function init(){

  client.set(new MQTT.Client(
    VITE_PUBLIC_MQTT_HOST,
    Number(VITE_PUBLIC_MQTT_PORT),
    "/"
  ))

  console.log('Client init OK')


}