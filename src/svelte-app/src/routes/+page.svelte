<script lang="ts">
	import Global from '$lib/components/Global.svelte';
	import { page } from '$app/stores';
	import { preferences } from '$lib/store.ts';
	import { Button, Col, Container, Row } from 'sveltestrap';
	import Thread from '$lib/components/Thread.svelte';
	let unique = [{}];
	let prefs = {};
	preferences.subscribe((x) => (prefs = x));
	$: scroll_event = {};
	let restart = () => (unique = [{}]);
</script>

<div class="text-center">
	<a href="/register"><Button>Get Nostrified</Button></a>
</div>

{#if prefs.stack}
	<table class="stack-table">
		<tr>
			<td style="width: 50%">
				<div
					style={'height:' + window.innerHeight + 'px;'}
					class="stack-div"
					on:scroll={(e) => (scroll_event = e)}
				>
					<Global {restart} {scroll_event} base="/" />
				</div>
			</td>
			<td style="width: 50%">
				<div style={'height:' + window.innerHeight + 'px;'} class="stack-div">
					{#each unique as key (key)}
						<Thread {restart} base="/" />
					{/each}
				</div>
			</td>
		</tr>
	</table>
{:else}
	<Global />
{/if}

<style>
	:global(.stack-div) {
		overflow-y: scroll;
		padding: 5px;
	}
	:global(.stack-table) {
		table-layout: fixed;
		background-color: transparent !important;
		width: 100%;
	}
</style>
