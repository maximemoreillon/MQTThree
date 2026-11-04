const MAX_FAILURES = 10;
const WINDOW = 15 * 60 * 1000; // 15 minutes

const failures = new Map<string, { count: number; reset: number }>();

/** Whether this client has failed to log in too many times recently */
export function isRateLimited(client: string) {
	const entry = failures.get(client);
	if (!entry) return false;
	if (entry.reset < Date.now()) {
		failures.delete(client);
		return false;
	}
	return entry.count >= MAX_FAILURES;
}

export function recordFailure(client: string) {
	const entry = failures.get(client);
	if (entry && entry.reset > Date.now()) entry.count++;
	else failures.set(client, { count: 1, reset: Date.now() + WINDOW });
}

export function clearFailures(client: string) {
	failures.delete(client);
}
