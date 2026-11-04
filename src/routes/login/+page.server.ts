import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { checkCredentials } from '#lib/server/broker.ts';
import { createSession } from '#lib/server/session.ts';
import { clearFailures, isRateLimited, recordFailure } from '#lib/server/rateLimit.ts';

export const actions: Actions = {
	// The MQTT broker is the authority: credentials are valid if the broker accepts them
	default: async ({ request, cookies, getClientAddress }) => {
		const client = getClientAddress();
		if (isRateLimited(client))
			return fail(429, { message: 'Too many failed attempts, try again later' });

		const formData = await request.formData();
		const username = String(formData.get('username') ?? '');
		const password = String(formData.get('password') ?? '');
		const remember = formData.get('remember') === 'on';

		if (!username || !password)
			return fail(400, { message: 'Username and password are required' });

		const result = await checkCredentials(username, password);

		if (result === 'unreachable') return fail(502, { message: 'MQTT broker unreachable' });

		if (result === 'rejected') {
			recordFailure(client);
			return fail(401, { message: 'Access denied' });
		}

		clearFailures(client);
		createSession(cookies, username, remember);
		redirect(303, '/');
	}
};
