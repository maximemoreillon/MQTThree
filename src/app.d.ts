// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/** Set when the request carries a valid session */
			username?: string;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
