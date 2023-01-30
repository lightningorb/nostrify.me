<script lang="ts">
	import { preferences } from '$lib/store.ts';
	import { hash_profile_filler } from '$lib/utils.ts';
	export let is_global = false;
	export let src;
	export let alt;
	export let size = '30px';
	var prefs = {};
	preferences.subscribe((x) => (prefs = x));
	$: show_images = (is_global && prefs.show_global_images) || (!is_global && prefs.show_images);
	function preload(src) {
		return new Promise(function (resolve) {
			let img = new Image();
			img.onload = resolve;
			img.src = src;
		});
	}
	let hashed_src = 'https://nostrify.me/avatar' + hash_profile_filler(alt) + '.jpeg';
</script>

<span style="--size: {size}">
	{#if show_images}
		{#if src}
			{#await preload(src)}
				<img src={hashed_src} {alt} class="avatar" />
			{:then _}
				<img {src} {alt} class="avatar" />
			{/await}
		{:else}
			<img src={hashed_src} {alt} class="avatar" />
		{/if}
	{:else}
		<img src={hashed_src} class="avatar" {alt} />
	{/if}
</span>

<style>
	:global(.avatar) {
		height: var(--size);
		width: var(--size);
		border-radius: 30px;
	}
</style>
