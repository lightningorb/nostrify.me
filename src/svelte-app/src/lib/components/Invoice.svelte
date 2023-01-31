<script lang="ts">
	import QrCode from '$lib/components/QRCode.svelte';
	import { Button } from 'sveltestrap';
	export let bolt11: string;
	let show_invoice: boolean = false;
</script>

<!-- {#if show_invoice}
	{bolt11}
{:else}
	<a class="btn" on:click|capture={() => (show_invoice = true)}>Show invoice</a>
{/if}
 -->
<QrCode squareSize={300} codeValue={bolt11} />
