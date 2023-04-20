import fs from "fs"
import path from "path"

export default defineEventHandler(async (event) => {
  const filePath = path.join("config", "model")
  return sendStream(event, fs.createReadStream(filePath))
})
