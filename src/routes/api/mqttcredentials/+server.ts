import { json } from '@sveltejs/kit';
import { MQTT_PASSWORD, MQTT_USERNAME } from '$app/env/private';

export async function GET() {
	return json({
		username: MQTT_USERNAME,
		password: MQTT_PASSWORD
	});
}
