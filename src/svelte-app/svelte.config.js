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
		alias: {
			components: 'src/components/' // can't use this for some reason, breaks the build
		},
		version: {
			name: Date.now().toString()
		},
		paths: {
			base: process.env.BN_SVELTE_BASE
		},
		prerender: {
			entries: ['/', '/profile'],
		    crawl: false
	    },
	}
};

export default config;

