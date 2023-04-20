import fs from "fs"
import path from "path"

export default defineEventHandler(async (event) => {
  const filePath = path.join("config", "config.yml")

  return sendStream(event, fs.createReadStream(filePath))
})
