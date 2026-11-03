import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { JWT_SECRET, MQTT_PASSWORD, MQTT_USERNAME } from '$app/env/private';
import jwt from 'jsonwebtoken';

// NOTE: Actions always use POST requests
export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (username !== MQTT_USERNAME || password !== MQTT_PASSWORD)
			return fail(401, { message: 'Access denied' });

		// TODO: find out if jwt really necessary
		const token = jwt.sign({}, JWT_SECRET!); // presence checked at startup (hooks.server.ts)

		cookies.set('token', token, { path: '/', maxAge: 60 * 60 * 24 * 365 });

		redirect(302, '/');
	}
};
