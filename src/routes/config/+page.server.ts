import path from 'path'
import { configDir, devicesFileName, modelFileName } from '$lib/config.js'
import { redirectIfUnauthorized } from '$lib/auth';
import {writeFileSync} from 'fs'
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

const configPath = path.join(configDir, devicesFileName)
const modelPath = path.join(configDir, modelFileName)

// NOTE: Actions always use POST requests
export const actions: Actions = {

    modelUpload: async (event) => {

      await redirectIfUnauthorized(event)
      const formData = await event.request.formData()

      const file = formData.get('model') as File
      // if(!file) throw new Error('Missing model')
      const fileArrayBuffer = await file.arrayBuffer()
  
      // @ts-ignore
      writeFileSync(modelPath,Buffer.from(fileArrayBuffer))
    },
    configUpload: async (event) => {


      await redirectIfUnauthorized(event)

      const formData = await event.request.formData()

      const file = formData.get('config') as File
      if(!file) throw new Error('Missing config')
      const fileArrayBuffer = await file.arrayBuffer()
  
      // @ts-ignore
      writeFileSync(configPath,Buffer.from(fileArrayBuffer))

    }
        
}