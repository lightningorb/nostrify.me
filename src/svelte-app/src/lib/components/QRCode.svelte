<script>
	import { onMount } from 'svelte';
	import { getRandomInt } from '$lib/utils.ts';
	export let codeValue;
	export let squareSize;
	let qrcode;
	let myInput = null;
	const id = getRandomInt(0, 100000000).toString();
	onMount(() => {
		var doc = {
			text: codeValue,
			width: squareSize,
			height: squareSize,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: QRCode.CorrectLevel.H
		};
		var qrcode = new QRCode(id, doc);
	});
</script>

<div {id} bind:this={myInput} />

<style>
	#qrcode {
		width: 20px;
		height: 200x;
		margin-top: 15px;
	}
</style>
