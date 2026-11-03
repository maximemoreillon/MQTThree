import { error } from '@sveltejs/kit';
import type { Handle, ServerInit } from '@sveltejs/kit/hooks';
import { JWT_SECRET, MQTT_PASSWORD, MQTT_USERNAME } from '$app/env/private';
import { checkAuth } from '#lib/auth.ts';

export const init: ServerInit = () => {
	const missing = Object.entries({ MQTT_USERNAME, MQTT_PASSWORD, JWT_SECRET })
		.filter(([, value]) => !value)
		.map(([name]) => name);
	if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
};

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api')) {
		try {
			checkAuth(event);
		} catch {
			// TODO: consider redirecting
			error(401, 'You shall not pass!');
		}
	}

	return resolve(event);
};
