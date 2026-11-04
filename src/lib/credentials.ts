// MQTT credentials kept in the browser so it can connect to the broker directly.
// "Remember me" keeps them in localStorage, otherwise they only last for the browser session.

const KEY = 'mqtthree:credentials';

export type Credentials = { username: string; password: string };

// Fallback if storage is unavailable (e.g. blocked): credentials last until the page reloads
let inMemory: Credentials | undefined;

function storages() {
	try {
		return { local: localStorage, session: sessionStorage };
	} catch {
		return undefined;
	}
}

export function saveCredentials(credentials: Credentials, remember: boolean) {
	inMemory = credentials;
	const s = storages();
	if (!s) return;
	try {
		(remember ? s.session : s.local).removeItem(KEY);
		(remember ? s.local : s.session).setItem(KEY, JSON.stringify(credentials));
	} catch {
		// Keep the in-memory copy
	}
}

export function loadCredentials(): Credentials | undefined {
	const s = storages();
	for (const storage of s ? [s.session, s.local] : []) {
		try {
			const value = storage.getItem(KEY);
			if (value) return JSON.parse(value);
		} catch {
			// Ignore unreadable entries
		}
	}
	return inMemory;
}

export function clearCredentials() {
	inMemory = undefined;
	const s = storages();
	if (!s) return;
	for (const storage of [s.session, s.local]) {
		try {
			storage.removeItem(KEY);
		} catch {
			// Nothing to clear
		}
	}
}
