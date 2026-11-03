import { error, redirect } from '@sveltejs/kit';
import type { Handle, ServerInit } from '@sveltejs/kit/hooks';
import { readSession, usesRandomSecret } from '#lib/server/session.ts';

const PUBLIC_PATHS = ['/login'];

export const init: ServerInit = () => {
	if (usesRandomSecret)
		console.warn('SESSION_SECRET is not set: using a random one, sessions will not survive restarts');
};

export const handle: Handle = async ({ event, resolve }) => {
	const session = readSession(event.cookies);
	event.locals.username = session?.username;

	const { pathname } = event.url;
	if (!session && !PUBLIC_PATHS.includes(pathname)) {
		if (pathname.startsWith('/api')) error(401, 'You shall not pass!');
		redirect(303, '/login');
	}

	return resolve(event);
};
