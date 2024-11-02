import path from 'path'
import { configDir, devicesFileName, modelFileName } from '$lib/config.js'
import { checkAuth } from '$lib/auth';
import {writeFileSync} from 'fs'
import type { Actions } from './$types';

const configPath = path.join(configDir, devicesFileName)
const modelPath = path.join(configDir, modelFileName)

// NOTE: Actions always use POST requests
export const actions: Actions = {

    modelUpload: async (event) => {

      checkAuth(event)
      const formData = await event.request.formData()

      const file = formData.get('model') as File
      // if(!file) throw new Error('Missing model')
      const fileArrayBuffer = await file.arrayBuffer()
  
      // @ts-ignore
      writeFileSync(modelPath,Buffer.from(fileArrayBuffer))
    },
    configUpload: async (event) => {


      checkAuth(event)
      const formData = await event.request.formData()

      const file = formData.get('config') as File
      if(!file) throw new Error('Missing config')
      const fileArrayBuffer = await file.arrayBuffer()
  
      // @ts-ignore
      writeFileSync(configPath,Buffer.from(fileArrayBuffer))

    }
        
}