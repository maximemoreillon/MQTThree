import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { z } from 'zod';
import { devicesSchema } from '#lib/deviceSchema.ts';
import type { Device } from '#lib/devices.ts';

const dir = './config';
const filePath = path.join(dir, 'devices.yml');

export type ParseResult = { ok: true; devices: Device[] } | { ok: false; message: string };

/** Parses and validates the content of a devices.yml file */
export function parseDevices(text: string): ParseResult {
	let data: unknown;
	try {
		data = YAML.parse(text, { prettyErrors: true });
	} catch (error) {
		return { ok: false, message: `Invalid YAML: ${(error as Error).message}` };
	}

	// An empty file means no devices
	const result = devicesSchema.safeParse(data ?? []);
	if (!result.success) return { ok: false, message: z.prettifyError(result.error) };
	return { ok: true, devices: result.data };
}

export async function readDevices(): Promise<ParseResult> {
	return parseDevices(await fs.promises.readFile(filePath, 'utf8'));
}

/** Writes the file only if it is valid, so a bad upload never replaces a working config */
export async function writeDevices(text: string): Promise<ParseResult> {
	const result = parseDevices(text);
	if (!result.ok) return result;

	await fs.promises.mkdir(dir, { recursive: true });
	await fs.promises.writeFile(filePath, text);
	return result;
}
