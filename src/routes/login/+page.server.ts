import { redirect, fail} from '@sveltejs/kit';
import type { Actions } from './$types';
import {env} from "$env/dynamic/private"
import jwt from 'jsonwebtoken'

const {MQTT_USERNAME, MQTT_PASSWORD, JWT_SECRET} = env

// NOTE: Actions always use POST requests
export const actions: Actions = {
    default: async ({ request, cookies }) => {

      const formData = await request.formData();
      const username = formData.get('username');
      const password = formData.get('password');

      if (username !== MQTT_USERNAME || password !== MQTT_PASSWORD) return fail(401, {message: 'Access denied'})


      const cookiesOptions = { 
        path: '/', 
        maxAge: 60 * 60 * 24 * 365, 
      }

      // TODO: find out if jwt really necessary
      const token = jwt.sign({}, JWT_SECRET)

      cookies.set( 'token', token, cookiesOptions )

      throw redirect(302, '/')

    }
        
}