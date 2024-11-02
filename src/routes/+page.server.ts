import { json, redirect } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import { configDir, devicesFileName } from '$lib/config.js'
import {  redirectIfUnauthorized } from '$lib/auth'
import {env} from "$env/dynamic/private"

const {MQTT_USERNAME, MQTT_PASSWORD} = env


function readDevices(){
  const filePath = path.join(configDir, devicesFileName)

  try {
    const file = fs.readFileSync(filePath, 'utf8')
    return YAML.parse(file)

  } catch (error: any) {
    if(error.code === 'ENOENT') return []
    else throw error
  }

}

export async function load(event) {


  await redirectIfUnauthorized(event)


  const devices = readDevices()
  const mqttCredentials = {
    username: MQTT_USERNAME, 
    password: MQTT_PASSWORD
  }

  return {devices, mqttCredentials}
  


}