import fs from "fs"
import path from "path"

// PROBLEM: This probably prevents any kind of caching mechanism
export default defineEventHandler(async (event) => {
  const filePath = path.join("config", "model")
  return sendStream(event, fs.createReadStream(filePath))
})
