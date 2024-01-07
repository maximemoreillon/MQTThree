import {env} from "$env/dynamic/private"
import { json } from '@sveltejs/kit'

const {MQTT_USERNAME, MQTT_PASSWORD} = env

export async function GET(){

  return json({
    username: MQTT_USERNAME, 
    password: MQTT_PASSWORD
  })
}
