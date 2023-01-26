/*
 * @Author: lnorb.com
 * @Date:   2023-01-26 16:41:17
 * @Last Modified by:   lnorb.com
 * @Last Modified time: 2023-01-26 16:41:47
 */

import coffee from 'vite-plugin-coffee';
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		target: 'es2020',
		minify: false
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
