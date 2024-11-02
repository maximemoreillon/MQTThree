import fs from 'fs'
import path from 'path'
import { configDir, modelFileName } from '$lib/config.js'
const modelPath = path.join(configDir,modelFileName)




export async function GET(){

  const data = await fs.promises.readFile(modelPath)
  const response = new Response(data)
  response.headers.set('Cache-control', 'max-age=604800')
  return response
}


