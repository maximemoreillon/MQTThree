import { defineEnvVars } from '@sveltejs/kit/env';

// Secrets are optional here so the app can be built without them (e.g. in CI).
// Their presence is checked when the server starts, see `init` in hooks.server.ts
const secret = (value: string | undefined) => value;

export const variables = defineEnvVars({
	MQTT_USERNAME: { description: 'MQTT username, also used to log into the app', schema: secret },
	MQTT_PASSWORD: { description: 'MQTT password, also used to log into the app', schema: secret },
	JWT_SECRET: { description: 'Secret used to sign session tokens', schema: secret },
	PUBLIC_MQTT_HOST: {
		public: true,
		description: 'Hostname of the MQTT broker (WebSocket listener)',
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
	}
});
