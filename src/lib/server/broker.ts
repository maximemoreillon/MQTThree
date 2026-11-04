import mqtt from 'mqtt';
import { MQTT_URL } from '$app/env/private';
import { PUBLIC_MQTT_HOST, PUBLIC_MQTT_PORT, PUBLIC_MQTT_USE_SSL } from '$app/env/public';
import { isAuthError } from '#lib/mqttErrors.ts';

const brokerUrl =
	MQTT_URL ?? `${PUBLIC_MQTT_USE_SSL ? 'wss' : 'ws'}://${PUBLIC_MQTT_HOST}:${PUBLIC_MQTT_PORT}/`;

const TIMEOUT = 5000;

export type CredentialsCheck = 'ok' | 'rejected' | 'unreachable';

/** Asks the broker whether it accepts these credentials, by connecting and disconnecting right away */
export function checkCredentials(username: string, password: string): Promise<CredentialsCheck> {
	return new Promise((resolve) => {
		const client = mqtt.connect(brokerUrl, {
			username,
			password,
			reconnectPeriod: 0,
			connectTimeout: TIMEOUT
		});

		let settled = false;
		const settle = (result: CredentialsCheck, error?: unknown) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			if (result === 'unreachable') console.error(`MQTT broker ${brokerUrl} unreachable`, error ?? '');
			client.end(true);
			resolve(result);
		};

		const timer = setTimeout(() => settle('unreachable', 'timeout'), TIMEOUT);
		client.on('connect', () => settle('ok'));
		client.on('error', (error) => settle(isAuthError(error) ? 'rejected' : 'unreachable', error));
		client.on('close', () => settle('unreachable', 'connection closed'));
	});
}
