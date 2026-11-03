import type { RequestEvent } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$app/env/private';

export const checkAuth = ({ cookies }: RequestEvent) => {
	const token = cookies.get('token');
	if (!token) throw new Error('No token');
	jwt.verify(token, JWT_SECRET!); // presence checked at startup (hooks.server.ts)
};
