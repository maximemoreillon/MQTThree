// This is unused because using form-actions
// https://kit.svelte.dev/docs/form-actions

import { json } from '@sveltejs/kit'
import { env } from "$env/dynamic/private"
import jwt from 'jsonwebtoken'

const {MQTT_USERNAME, MQTT_PASSWORD, JWT_SECRET} = env

export async function POST({ request }){

  const {username, password} = await request.json()

  if (username !== MQTT_USERNAME || password !== MQTT_PASSWORD) throw 'Access denied'

  const token = jwt.sign({}, JWT_SECRET)

  return json({token})
}