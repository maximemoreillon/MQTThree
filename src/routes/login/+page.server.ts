import { redirect, fail} from '@sveltejs/kit';
import type { Actions } from './$types';
import {env} from "$env/dynamic/private"
const {MQTT_USERNAME, MQTT_PASSWORD} = env

export const actions: Actions = {
    default: async ({ request, cookies }) => {

      const formData = await request.formData();
      const username = formData.get('username');
      const password = formData.get('password');


      if (username !== MQTT_USERNAME || password !== MQTT_PASSWORD) return fail(401, {message: 'Access denied'})

      const cookiesOptions = { 
        path: '/', 
        maxAge: 60 * 60 * 24 * 365, 
        httpOnly: false
      }

      cookies.set( 'auth', '42', cookiesOptions )

      throw redirect(302, '/')

    }
        
}