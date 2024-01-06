import fs from 'fs'
import path from 'path'

const modelDirectory = './config'
const modelFileName = 'model.glb'

export async function GET(){

  const modelPath = path.join(modelDirectory, modelFileName)
  const data = await fs.promises.readFile(modelPath)
  return new Response(data)
}

export async function POST({ request }){
  const formData = Object.fromEntries(await request.formData());

    if ( !formData.model) {
      throw 'No model'
    }

    fs.mkdirSync(modelDirectory, { recursive: true });

    const { model } = formData as { model: File };

    const modelPath = path.join(modelDirectory,modelFileName)
    fs.writeFileSync(modelPath, Buffer.from(await model.arrayBuffer()));
  return new Response("hi")
}