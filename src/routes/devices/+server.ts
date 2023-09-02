import { json } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

const dir = './config'
const filename = 'devices.yml'
const filePath = path.join(dir, filename)

export async function GET(){

  const file = fs.readFileSync(filePath, 'utf8')
  const devices = YAML.parse(file)

  return json(devices)
}

export async function POST({ request }){
  const formData = Object.fromEntries(await request.formData());

    if ( !formData.devices) {
      throw 'No devices'
    }

    fs.mkdirSync(dir, { recursive: true });

    const { devices } = formData as { devices: File };

    fs.writeFileSync(filePath, Buffer.from(await devices.arrayBuffer()));
  return new Response("hi")
}