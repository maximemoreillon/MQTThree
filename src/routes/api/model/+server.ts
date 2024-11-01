import fs from 'fs'
import path from 'path'

const modelDirectory = './config'
// PROBLEM: model folder needs to be resolved somehow
// const modelDirectory = 'static/test'
const modelFileName = 'model.glb'


export async function POST({ request }){
  const formData = Object.fromEntries(await request.formData());

    if ( !formData.model) throw 'No model'
    
    fs.mkdirSync(modelDirectory, { recursive: true });

    const { model } = formData as { model: File };

    const modelPath = path.join(modelDirectory,modelFileName)
    // @ts-ignore
    fs.writeFileSync(modelPath, Buffer.from(await model.arrayBuffer()));
  return new Response("OK")
}


export async function GET(){

  const modelPath = path.join(modelDirectory, modelFileName)

  const data = await fs.promises.readFile(modelPath)
  const response = new Response(data)
  response.headers.set('Cache-control', 'max-age=604800')
  return response
}


