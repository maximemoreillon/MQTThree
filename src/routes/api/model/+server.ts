import fs from 'fs'
import path from 'path'
import { configDir, modelFileName } from '$lib/config.js'
const modelPath = path.join(configDir,modelFileName)


// TODO: transform this into a form action
export async function POST({ request }){
  const formData = Object.fromEntries(await request.formData());

    if ( !formData.model) throw 'No model'
    
    fs.mkdirSync(configDir, { recursive: true });

    const { model } = formData as { model: File };

    // @ts-ignore
    fs.writeFileSync(modelPath, Buffer.from(await model.arrayBuffer()));
  return new Response("OK")
}


export async function GET(){

  const data = await fs.promises.readFile(modelPath)
  const response = new Response(data)
  response.headers.set('Cache-control', 'max-age=604800')
  return response
}


