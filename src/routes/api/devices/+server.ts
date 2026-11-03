import { error, json } from '@sveltejs/kit';
import { readDevices, writeDevices } from '#lib/server/devices.ts';

export async function GET() {
	const result = await readDevices();
	if (!result.ok) return json({ message: `devices.yml is invalid:\n${result.message}` }, { status: 500 });
	return json(result.devices);
}

export async function POST({ request }) {
	const file = (await request.formData()).get('devices');
	if (!(file instanceof File)) error(400, 'No devices file');

	const result = await writeDevices(await file.text());
	if (!result.ok) return json({ message: result.message }, { status: 400 });

	return new Response('OK');
}
