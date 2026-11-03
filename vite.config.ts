import adapter from '@sveltejs/adapter-node';
import { withPwa } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		withPwa(
			// SvelteKit options
			{
				compilerOptions: {
					// Force runes mode for the project, except for libraries. Can be removed in Svelte 6.
					runes: ({ filename }) =>
						filename.split(/[/\\]/).includes('node_modules') ? undefined : true
				},
				adapter: adapter()
			},
			// PWA options
			{
				generateSW: {
					// The app has no prerendered pages, which the plugin's default glob patterns expect
					globStrict: false,
					// No offline fallback page: pages are server-rendered and the app is useless offline anyway
					navigateFallback: null
				},
				// https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html#web-app-manifest
				manifest: {
					name: 'MQTThree',
					short_name: 'MQTThree',
					description: 'MQTT + Threejs',
					theme_color: '#000',
					icons: [
						{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
						{ src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
					]
				}
			}
		)
	],
	ssr: {
		noExternal: ['three']
	}
});
