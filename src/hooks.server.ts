import {checkAuth} from '$lib/auth'

export async function handle({ event, resolve }) {

	if (event.url.pathname.startsWith('/api')) {
		// TODO: error handling
		await checkAuth(event)
	  return await resolve(event);;
	}


	return await resolve(event);
}