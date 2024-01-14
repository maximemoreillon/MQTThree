// This is unused
// PROBLEM: This does not work because cookies are not set properly

import { json } from '@sveltejs/kit'
import {env} from "$env/dynamic/private"
import jwt from 'jsonwebtoken'

const {MQTT_USERNAME, MQTT_PASSWORD, JWT_SECRET} = env

export async function POST({ request }){

  const {body: {username, password}, cookies} = request

  if (username !== MQTT_USERNAME || password !== MQTT_PASSWORD) throw 'Access denied'

  const cookiesOptions = { 
    path: '/', 
    maxAge: 60 * 60 * 24 * 365, 
  }

  // TODO: find out if jwt really necessary
  const token = jwt.sign({}, JWT_SECRET)

  // PROBLEM: This wont set cookies properly
  cookies.set( 'token', token, cookiesOptions )


  return json({jwt: 'test'})
}