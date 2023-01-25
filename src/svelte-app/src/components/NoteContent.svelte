<script lang="ts">
	import { preferences } from '$lib/store.ts';
	import { print, getRandomInt, breakLongWords } from '$lib/utils.ts';
	import SvelteMarkdown from 'svelte-markdown';
	export var source = '';

	var prefs = {};
	preferences.subscribe((x) => (prefs = x));

	var decodeString = (str) => {
		return str.replace(/&#([0-9]+);/g, (match, charCode) => String.fromCharCode(charCode));
	};

	function extractImageLinks(content: string): string[] {
		const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;
		const links: string[] = [];
		let match;
		while ((match = imgRegex.exec(content))) {
			links.push(match[1]);
		}
		return links;
	}

	var makeSafeHtml = (content) => {
		content = content.replace(/\&#[^;]*;/gm, '');
		var imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;
		content = content.replace(imgRegex, '');
		content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
		content = breakLongWords(content);
		return content;
	};

	var links = extractImageLinks(source);
</script>

<br />
<br />
{makeSafeHtml(source)}
{#if prefs.show_images}
	{#each links as link}
		<img src={link} class="img-fluid" alt="image" />
	{/each}
{/if}
<br />
<br />
