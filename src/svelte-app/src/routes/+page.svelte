<script lang="ts">
	import Global from '../components/Global.svelte';
	import { page } from '$app/stores';
	import { preferences } from '$lib/store.ts';
	import { Col, Container, Row } from 'sveltestrap';
	import Thread from '../components/Thread.svelte';
	let unique = [{}];
	let prefs = {};
	preferences.subscribe((x) => (prefs = x));
	$: scroll_event = {};
	let restart = () => (unique = [{}]);
</script>

{#if prefs.stack}
	<table style="table-layout:fixed; background-color: transparent !important; ">
		<tr>
			<td style="width: 50">
				<div
					style={'overflow-y: scroll; height:' + window.innerHeight + 'px;'}
					on:scroll={(e) => (scroll_event = e)}
				>
					<Global {restart} {scroll_event} base="/" />
				</div>
			</td>
			<td style="width: 50%">
				<div style={'overflow-y: scroll; height:' + window.innerHeight + 'px;'}>
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
