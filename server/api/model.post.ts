import formidable from "formidable"
import fs from "fs"
import path from "path"

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
  const { files, fields } = (await parseForm(req)) as any
  const { model } = files
  if (!model) throw "Model not provided"

  const { filepath, originalFilename } = model
  const newPath = `${path.join("public", "model", "model")}`
  fs.copyFileSync(filepath, newPath)

  return "Yes"
})
