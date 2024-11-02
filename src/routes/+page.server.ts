import { json } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import { configDir, devicesFileName } from '$lib/config.js'


export function load() {

  const filePath = path.join(configDir, devicesFileName)

  let devices: any[] = []


  try {
    const file = fs.readFileSync(filePath, 'utf8')
    devices = YAML.parse(file)

  } catch (error: any) {


    if(error.code === 'ENOENT') devices = []
    else throw error
    
  }


  return {devices}
  


}