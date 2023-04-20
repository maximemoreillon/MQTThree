import formidable from "formidable"
import fs from "fs"
import path from "path"

// FIXME: DUPLICATION

const parseForm = (req: any) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ files, fields })
    })
  })

export default defineEventHandler(async (event) => {
  const { req } = event.node
  const { files } = (await parseForm(req)) as any
  const { model } = files
  if (!model) throw "Model not provided"

  const { filepath } = model
  const configPath = path.resolve("public/config")
  console.log(configPath)
  const newPath = path.join(configPath, "model")
  fs.copyFileSync(filepath, newPath)

  return "Yes"
})
