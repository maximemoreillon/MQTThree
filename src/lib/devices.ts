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

/** Extracts the `state` field of a status message, if any */
export function getState(payload: unknown): string | undefined {
	if (typeof payload !== 'object' || payload === null) return;
	const { state } = payload as { state?: unknown };
	return typeof state === 'string' ? state : undefined;
}
