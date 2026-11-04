import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { deleteSession } from '#lib/server/session.ts';

export const actions: Actions = {
	default: async ({ cookies }) => {
		deleteSession(cookies);
		redirect(303, '/login');
	}
};
