import {isAuthorized} from '$lib/auth'
import { error } from '@sveltejs/kit';

export async function handle({ event, resolve }) {

	if (event.url.pathname.startsWith('/api')) {

		if (!isAuthorized(event)) throw error(401, {message: 'You shall not pass!'})

	  return await resolve(event);
	}

	return await resolve(event);
}