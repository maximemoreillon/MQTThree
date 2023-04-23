import fs from "fs"
import path from "path"

import { parseForm } from "./utils"

export default defineEventHandler(async (event) => {
  const { req } = event.node
  const { files } = (await parseForm(req)) as any
  const { model } = files
  if (!model) throw "Model not provided"

  const configPath = path.resolve("config")
  if (!fs.existsSync(configPath)) fs.mkdirSync(configPath)

  const { filepath } = model
  const newPath = path.join(configPath, "model")
  fs.copyFileSync(filepath, newPath)

  return "OK"
})
