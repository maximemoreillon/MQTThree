import { error } from '@sveltejs/kit';
import fs from 'node:fs';
import path from 'node:path';

const modelDirectory = './config';
const modelPath = path.join(modelDirectory, 'model.glb');

export async function GET() {
	const data = await fs.promises.readFile(modelPath);
	return new Response(data, {
		headers: {
			'Content-Type': 'model/gltf-binary',
			'Cache-Control': 'max-age=604800'
		}
	});
}

export async function POST({ request }) {
	const model = (await request.formData()).get('model');
	if (!(model instanceof File)) error(400, 'No model file');

	await fs.promises.mkdir(modelDirectory, { recursive: true });
	await fs.promises.writeFile(modelPath, Buffer.from(await model.arrayBuffer()));

	return new Response('OK');
}
