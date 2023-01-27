<script lang="ts">
	import { preferences } from '$lib/store.ts';
	import { hash_profile_filler } from '$lib/utils.ts';
	export let is_global = false;
	export let src;
	export let alt;
	export let width = 30;
	export let height = 30;
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
</script>

{#if show_images}
	{#if src}
		{#await preload(src)}
			<img
				src={'https://nostrify.me/avatar' + hash_profile_filler(alt) + '.jpeg'}
				{alt}
				style={`width: ${width}px; height: ${height}px; border-radius: 30px;`}
			/>
		{:then _}
			<img {src} {alt} style={`width: ${width}px; height: ${height}px; border-radius: 30px;`} />
		{/await}
	{:else}
		<img
			src={'https://nostrify.me/avatar' + hash_profile_filler(alt) + '.jpeg'}
			{alt}
			style={`width: ${width}px; height: ${height}px; border-radius: 30px;`}
		/>
	{/if}
{:else}
	<img
		src={'https://nostrify.me/avatar' + hash_profile_filler(alt) + '.jpeg'}
		{alt}
		style={`width: ${width}px; height: ${height}px; border-radius: 30px;`}
	/>
{/if}
