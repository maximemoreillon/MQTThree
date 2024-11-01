import { json } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import { configDir, devicesFileName } from '$lib/config.js'

const filePath = path.join(configDir, devicesFileName)

export async function GET(){

  const file = fs.readFileSync(filePath, 'utf8')
  const devices = YAML.parse(file)

  return json(devices)
}

// TODO: transform this into a form action
export async function POST({ request }){
  const formData = Object.fromEntries(await request.formData());

    if ( !formData.devices) throw 'No devices'

    fs.mkdirSync(configDir, { recursive: true });

    const { devices } = formData ;

    // @ts-ignore
    fs.writeFileSync(filePath, Buffer.from(await devices.arrayBuffer()));
  return new Response("hi")
}