import coffee from 'vite-plugin-coffee';
// import { sveltekit } from '@sveltejs/kit/vite';

// /** @type {import('vite').UserConfig} */
// const config = {
// 	plugins: [sveltekit()]
// };

// export default config;

import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		target: 'es2020'
	},
	optimizeDeps: {
		esbuildOptions: {
			target: 'es2020'
		}
	},
	plugins: [
		sveltekit(),
		coffee({
			jsx: false
		})
	],
	server: {
		port: 3000,
		strictPort: false
	},
	preview: {
		port: 3000,
		strictPort: false
	}
};

export default config;
