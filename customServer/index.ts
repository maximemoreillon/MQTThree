import express from "express"
import path from "path"
const app = express()
const configPath = path.resolve("config")
app.use("/express", express.static(configPath))
export default fromNodeMiddleware(app)
