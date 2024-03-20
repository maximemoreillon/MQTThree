import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			// Not sure if necessary
			// https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html#web-app-manifest
			manifest: {
				name: 'MQTThree',
				short_name: 'MQTThree',
				description: 'MQTT + Threejs',
				theme_color: '#000',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			// This is not an error: https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#sveltekit-pwa-plugin-options
			adapterFallback: 'index.html'
		})
	],
	ssr: {
		noExternal: ['three']
	}
});
