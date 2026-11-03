import { z } from 'zod';
import { deviceKey } from './devices.ts';

// Kept apart from devices.ts so that the client only imports the inferred types, not zod itself

const vec3 = z.strictObject({ x: z.number(), y: z.number(), z: z.number() });
const topic = z.string().trim().min(1);

const base = {
	topic,
	position: vec3,
	/** In degrees */
	rotation: vec3.partial().optional()
};

const onOffPayload = z
	.strictObject({ on: z.string().default('on'), off: z.string().default('off') })
	.prefault({});

export const lightSchema = z.strictObject({
	...base,
	type: z.literal('light'),
	commandTopic: topic,
	payload: onOffPayload
});

export const fanSchema = z.strictObject({
	...base,
	type: z.literal('fan'),
	commandTopic: topic,
	payload: onOffPayload
});

export const sensorSchema = z.strictObject({
	...base,
	type: z.literal('sensor'),
	/** Field of the JSON status message holding the value */
	key: z.string().min(1),
	unit: z.string().optional()
});

export const lockSchema = z.strictObject({
	...base,
	type: z.literal('lock'),
	commandTopic: topic,
	payload: z
		.strictObject({
			locked: z.string().default('locked'),
			unlocked: z.string().default('unlocked')
		})
		.prefault({})
});

export const deviceSchema = z.discriminatedUnion('type', [
	lightSchema,
	fanSchema,
	sensorSchema,
	lockSchema
]);

export const devicesSchema = z.array(deviceSchema).superRefine((devices, context) => {
	const seen = new Map<string, number>();
	devices.forEach((device, index) => {
		const key = deviceKey(device);
		const first = seen.get(key);
		if (first === undefined) seen.set(key, index);
		else
			context.addIssue({
				code: 'custom',
				path: [index, 'topic'],
				message: `Same device as entry ${first} (${key})`
			});
	});
});
