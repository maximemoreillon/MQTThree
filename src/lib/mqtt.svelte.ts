import mqtt, { type MqttClient } from 'mqtt';
import { PUBLIC_MQTT_HOST, PUBLIC_MQTT_PORT, PUBLIC_MQTT_USE_SSL } from '$app/env/public';
import { isAuthError } from '#lib/mqttErrors.ts';

type Handler = (payload: unknown) => void;

export const mqttState = $state({ connected: false, authFailed: false });

let client: MqttClient | undefined;
const handlers = new Map<string, Set<Handler>>();

export function hasClient() {
	return client !== undefined;
}

export function connect(username: string, password: string) {
	if (client) return;

	const protocol = PUBLIC_MQTT_USE_SSL ? 'wss' : 'ws';
	client = mqtt.connect(`${protocol}://${PUBLIC_MQTT_HOST}:${PUBLIC_MQTT_PORT}/`, {
		username,
		password,
		keepalive: 30,
		reconnectPeriod: 5000
	});

	client.on('connect', () => (mqttState.connected = true));
	client.on('close', () => (mqttState.connected = false));
	client.on('error', (error) => {
		console.error('MQTT error', error);
		if (!isAuthError(error)) return;
		// Retrying with rejected credentials is pointless
		disconnect();
		mqttState.authFailed = true;
	});
	client.on('message', (topic, message) => {
		const topicHandlers = handlers.get(topic);
		if (!topicHandlers) return;
		const payload = parse(message.toString());
		topicHandlers.forEach((handler) => handler(payload));
	});

	// Subscriptions registered before the client existed
	for (const topic of handlers.keys()) client.subscribe(topic);
}

export function disconnect() {
	client?.end(true);
	client = undefined;
	mqttState.connected = false;
	mqttState.authFailed = false;
}

/**
 * Listen to a topic. Returns a function that removes the listener
 * (and unsubscribes from the broker when nobody listens anymore).
 */
export function subscribe(topic: string, handler: Handler) {
	let topicHandlers = handlers.get(topic);
	if (!topicHandlers) {
		topicHandlers = new Set();
		handlers.set(topic, topicHandlers);
		client?.subscribe(topic);
	}
	topicHandlers.add(handler);

	return () => {
		topicHandlers.delete(handler);
		if (topicHandlers.size > 0) return;
		handlers.delete(topic);
		client?.unsubscribe(topic);
	};
}

export function publish(topic: string, payload: string) {
	if (!client || !mqttState.connected) return;
	client.publish(topic, payload);
}

function parse(message: string): unknown {
	try {
		return JSON.parse(message);
	} catch {
		return message;
	}
}
