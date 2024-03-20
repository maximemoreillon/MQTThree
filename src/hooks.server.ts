import {checkAuth} from '$lib/auth'
import { error } from '@sveltejs/kit';

export async function handle({ event, resolve }) {

	if (event.url.pathname.startsWith('/api')) {
		// TODO: error handling
		try {
			await checkAuth(event)
		} catch (err) {
			// TODO: consider redirecting
			throw error(401, {message: 'You shall not pass!'})
		}
	  return await resolve(event);;
	}


	return await resolve(event);
}