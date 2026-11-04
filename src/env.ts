import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	PUBLIC_MQTT_HOST: {
		public: true,
		description: 'Hostname of the MQTT broker WebSocket listener, as reached by the browser',
		schema: (value) => value || 'localhost'
	},
	PUBLIC_MQTT_PORT: {
		public: true,
		description: 'Port of the MQTT broker WebSocket listener',
		schema: (value) => Number(value || 9001)
	},
	PUBLIC_MQTT_USE_SSL: {
		public: true,
		description: 'Set to any non-empty value to connect with wss://',
		schema: (value) => !!value
	},
	MQTT_URL: {
		description:
			'Broker URL used by the server to check login credentials (e.g. mqtts://broker:8883). Defaults to the same WebSocket URL as the browser',
		schema: optional
	},
	SESSION_SECRET: {
		description:
			'Secret used to sign session cookies. If unset, a random one is generated at startup and sessions do not survive restarts',
		schema: optional
	}
});
