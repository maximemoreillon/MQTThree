import type { z } from 'zod';
import type {
	deviceSchema,
	fanSchema,
	lightSchema,
	lockSchema,
	sensorSchema
} from './deviceSchema.ts';

export type Vec3 = { x: number; y: number; z: number };

export type Device = z.infer<typeof deviceSchema>;
export type LightDevice = z.infer<typeof lightSchema>;
export type FanDevice = z.infer<typeof fanSchema>;
export type SensorDevice = z.infer<typeof sensorSchema>;
export type LockDevice = z.infer<typeof lockSchema>;

/**
 * Stable identity of a device: its status topic, plus the key for sensors,
 * since several sensors can read different fields of the same message
 */
export const deviceKey = (device: Device) =>
	device.type === 'sensor' ? `${device.topic}#${device.key}` : device.topic;

export const toArray = ({ x, y, z }: Vec3): [number, number, number] => [x, y, z];

const toRadians = (degrees = 0) => (degrees * Math.PI) / 180;

/** Rotation from the config (in degrees, every axis optional) as Euler angles in radians */
export const toRotation = (rotation: Partial<Vec3> = {}): [number, number, number] => [
	toRadians(rotation.x),
	toRadians(rotation.y),
	toRadians(rotation.z)
];

/** Case-insensitive comparison of MQTT payload values */
export const sameState = (a: string | undefined, b: string) => a?.toLowerCase() === b.toLowerCase();

/** Extracts the `state` field of a status message, if any */
export function getState(payload: unknown): string | undefined {
	if (typeof payload !== 'object' || payload === null) return;
	const { state } = payload as { state?: unknown };
	return typeof state === 'string' ? state : undefined;
}
