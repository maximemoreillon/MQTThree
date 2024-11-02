// This is unused

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

