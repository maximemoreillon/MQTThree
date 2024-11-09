import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA(
			{ 
				registerType: 'autoUpdate',
				injectRegister: 'auto' // Optional according to https://vite-pwa-org.netlify.app/guide/register-service-worker.html
			}
		)
	],
	ssr: {
		noExternal: ['three']
	}
});
