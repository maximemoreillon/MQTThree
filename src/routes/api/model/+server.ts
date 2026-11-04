import { error } from '@sveltejs/kit';
import fs from 'node:fs';
import path from 'node:path';

const modelDirectory = './config';
const modelPath = path.join(modelDirectory, 'model.glb');

export async function GET({ request }) {
	const stats = await fs.promises.stat(modelPath);
	// Changes whenever a new model is uploaded
	const etag = `W/"${stats.size}-${stats.mtimeMs}"`;
	const headers = {
		ETag: etag,
		// The browser keeps the model but checks with the server before each use,
		// so a new upload is picked up right away. private: it's behind the login.
		'Cache-Control': 'private, no-cache'
	};

	if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers });

	const data = await fs.promises.readFile(modelPath);
	return new Response(data, { headers: { ...headers, 'Content-Type': 'model/gltf-binary' } });
}

export async function POST({ request }) {
	const model = (await request.formData()).get('model');
	if (!(model instanceof File)) error(400, 'No model file');

	await fs.promises.mkdir(modelDirectory, { recursive: true });
	await fs.promises.writeFile(modelPath, Buffer.from(await model.arrayBuffer()));

	return new Response('OK');
}
