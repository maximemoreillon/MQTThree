import fs from 'fs'
import path from 'path'

export async function GET(){
  const data = await fs.promises.readFile(`./models/model.glb`)
  return new Response(data)
}

export async function POST({ request }){
  const formData = Object.fromEntries(await request.formData());

    if ( !formData.model) {
      throw 'No model'
    }

    const dir = './models'

    fs.mkdirSync(dir, { recursive: true });

    const { model } = formData as { model: File };

    // PROBLEM: static cannot be used for thi
    fs.writeFileSync(path.join(dir,`model.glb`), Buffer.from(await model.arrayBuffer()));
  return new Response("hi")
}