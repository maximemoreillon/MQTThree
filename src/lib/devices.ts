export type Vec3 = { x: number; y: number; z: number };

type BaseDevice = {
	topic: string;
	position: Vec3;
	rotation?: Partial<Vec3>;
};

export type LightDevice = BaseDevice & {
	type: 'light';
	commandTopic: string;
	payload?: { on?: string; off?: string };
};

export type FanDevice = BaseDevice & {
	type: 'fan';
	commandTopic: string;
	payload?: { on?: string; off?: string };
};

export type SensorDevice = BaseDevice & {
	type: 'sensor';
	key: string;
	unit?: string;
};

export type LockDevice = BaseDevice & {
	type: 'lock';
	commandTopic: string;
	payload?: { locked?: string; unlocked?: string };
};

export type Device = LightDevice | FanDevice | SensorDevice | LockDevice;

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
