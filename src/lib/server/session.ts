import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import { SESSION_SECRET } from '$app/env/private';

const COOKIE = 'session';
const REMEMBER_DURATION = 60 * 60 * 24 * 30; // 30 days, in seconds
const SESSION_DURATION = 60 * 60 * 12; // Without "remember me": 12 hours max, cookie dropped when the browser closes

const secret = SESSION_SECRET ?? randomBytes(32).toString('hex');

type Session = { username: string; expires: number };

const sign = (value: string) => createHmac('sha256', secret).update(value).digest('base64url');

export function createSession(cookies: Cookies, username: string, remember: boolean) {
	const duration = remember ? REMEMBER_DURATION : SESSION_DURATION;
	const session: Session = { username, expires: Date.now() + duration * 1000 };
	const value = Buffer.from(JSON.stringify(session)).toString('base64url');
	cookies.set(COOKIE, `${value}.${sign(value)}`, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: remember ? duration : undefined
	});
}

export function readSession(cookies: Cookies): Session | undefined {
	const [value, signature] = cookies.get(COOKIE)?.split('.') ?? [];
	if (!value || !signature) return;

	const expected = Buffer.from(sign(value));
	const actual = Buffer.from(signature);
	if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return;

	try {
		const session: Session = JSON.parse(Buffer.from(value, 'base64url').toString());
		return session.expires > Date.now() ? session : undefined;
	} catch {
		return;
	}
}

export function deleteSession(cookies: Cookies) {
	cookies.delete(COOKIE, { path: '/' });
}

export const usesRandomSecret = !SESSION_SECRET;
