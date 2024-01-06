import {checkAuthExternally} from '$lib/auth'
export async function handle({ event, resolve }) {

  // Require authentication for routes related to models
	if (event.url.pathname.startsWith('/api')) {
    await checkAuthExternally(event)
	  return await resolve(event);;
	}

  

	return await resolve(event);
}