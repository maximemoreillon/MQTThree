/** CONNACK codes meaning the broker rejected the credentials (MQTT 3.1.1: 4, 5 / MQTT 5: 134, 135) */
const AUTH_ERROR_CODES = new Set([4, 5, 134, 135]);

export function isAuthError(error: unknown) {
	const code = (error as { code?: unknown } | null)?.code;
	return typeof code === 'number' && AUTH_ERROR_CODES.has(code);
}
