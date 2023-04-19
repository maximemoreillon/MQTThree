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
  const { config } = files
  if (!config) throw "Config file not provided"

  const { filepath } = config
  const newPath = `${path.join("public", "config", "config.yml")}`
  fs.copyFileSync(filepath, newPath)

  return "Yes"
})
