<script lang="ts">
	import { page } from '$app/stores';
	import { preferences } from '$lib/store.ts';
	import { print, getRandomInt, breakLongWords } from '$lib/utils.ts';
	import Invoice from './Invoice.svelte';
	import SvelteMarkdown from 'svelte-markdown';
	export var source = '';
	export let is_global = false;

	var prefs = {};
	preferences.subscribe((x) => (prefs = x));

	$: show_images = (is_global && prefs.show_global_images) || (!is_global && prefs.show_images);

	var decodeString = (str) => {
		return str.replace(/&#([0-9]+);/g, (match, charCode) => String.fromCharCode(charCode));
	};
	const invRegex = /(lnbc[a-zA-Z0-9]*)/gi;
	var urlRegex =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
	var imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;

	function extractImageLinks(content: string): string[] {
		const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;
		const links: string[] = [];
		let match;
		while ((match = imgRegex.exec(content))) {
			links.push(match[1]);
		}
		return links;
	}

	function extractInvoices(content: string): string[] {
		const invoices: string[] = [];
		let match;
		while ((match = invRegex.exec(content))) {
			invoices.push(match[1]);
		}
		return invoices;
	}

	function extractURLs(content: string): string[] {
		const urls: string[] = [];
		let match;
		while ((match = urlRegex.exec(content))) {
			urls.push(match[1]);
		}
		return urls;
	}

	var makeSafeHtml = (content) => {
		content = content.replace(/\&#[^;]*;/gm, '');
		content = content.replace(invRegex, '');
		content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
		content = breakLongWords(content);
		return content;
	};

	var imgs = extractImageLinks(source);
	source = source.replace(imgRegex, '');
	var urls = extractURLs(source);
	source = source.replace(urlRegex, '[link]');
	var invoices = extractInvoices(source);
</script>

<br />
<br />
<p style="overflow-wrap: break-word;">{makeSafeHtml(source)}</p>
{#if show_images}
	{#each imgs as img}
		<img src={img} class="img-fluid" alt="image" />
	{/each}
{/if}
{#each invoices as invoice}
	<Invoice bolt11={invoice} />
{/each}
{#each urls as url}
	<a target="_blank" href={url}>{url.slice(0, 20)}...</a><br />
{/each}

<br />
<br />
