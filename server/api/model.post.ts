import fs from "fs"
import path from "path"

import { parseForm } from "./utils"

export default defineEventHandler(async (event) => {
  console.log(`Model upload event`)
  const { req } = event.node
  const { files } = (await parseForm(req)) as any
  const { model } = files
  if (!model) throw "Model not provided"

  const { filepath } = model
  const configPath = path.resolve("public/config")
  const newPath = path.join(configPath, "model")
  console.log({ newPath })
  fs.copyFileSync(filepath, newPath)

  return "Yes"
})
