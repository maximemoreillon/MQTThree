import fs from "fs"
import path from "path"

import { parseForm } from "./utils"

export default defineEventHandler(async (event) => {
  const { req } = event.node
  const { files } = (await parseForm(req)) as any
  const { config } = files
  if (!config) throw "Config file not provided"

  const configPath = path.resolve("config")

  if (!fs.existsSync(configPath)) fs.mkdirSync(configPath)

  const { filepath } = config
  const newPath = path.join(configPath, "config.yml")
  console.log(newPath)
  fs.copyFileSync(filepath, newPath)

  return "Yes"
})
