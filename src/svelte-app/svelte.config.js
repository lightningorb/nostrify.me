import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			strict: false,
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false
		}),
		trailingSlash: 'always'
	},

	preprocess: [
		preprocess({
			coffeescript: {
				bare: true,
				sourceMap: true
			}
		})
	]
};

export default config;
