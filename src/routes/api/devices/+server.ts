import { error, json } from '@sveltejs/kit';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const dir = './config';
const filePath = path.join(dir, 'devices.yml');

export async function GET() {
	const file = await fs.promises.readFile(filePath, 'utf8');
	return json(YAML.parse(file));
}

export async function POST({ request }) {
	const devices = (await request.formData()).get('devices');
	if (!(devices instanceof File)) error(400, 'No devices file');

	await fs.promises.mkdir(dir, { recursive: true });
	await fs.promises.writeFile(filePath, Buffer.from(await devices.arrayBuffer()));

	return new Response('OK');
}
