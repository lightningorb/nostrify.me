<script>
	import { onMount } from 'svelte';
	import initSqlJs from 'sql.js';
	import db from '$lib/db.coffee';
	import { print } from '$lib/utils.ts';
	import { Spinner } from 'sveltestrap';
	import Fa from 'svelte-fa/src/fa.svelte';
	import {
		faRightToBracket,
		faRightFromBracket,
		faDove
	} from '@fortawesome/free-solid-svg-icons/index.js';
	import { base } from '$app/paths';
	import { preferences, input_focus, key_pressed } from '$lib/store.ts';
	import { Styles } from 'sveltestrap';
	import { Col, Container, Row } from 'sveltestrap';
	import { get } from 'svelte/store';
	import pool from '$lib/pool.ts';
	export let data = null;
	let prefs = {};
	preferences.subscribe((x) => (prefs = x));
	$: connected_relays = {};
	let db_init = false;
	pool.init();
	pool.connect();
	$: connected = false;
	pool.on('connect', (x) => {
		connected_relays[x.url] = 1;
		connected = Object.entries(connected_relays).length / prefs.relays.length > 0.5;
	});
	async function init() {
		var SQL = await initSqlJs();
		db.init(SQL);
		db_init = true;
	}
	onMount(() => {
		init();
		if (window)
			window.addEventListener('scroll', () => {
				if (window.pageYOffset > 500) {
					left_style = 'padding-left: 10px; padding-right: 10px;';
				} else {
					left_style = 'padding-left: 50px; padding-right: 10px;';
				}
			});
	});
	var left_style = 'padding-left: 50px; padding-right: 10px;';
	$: input_has_focus = false;
	input_focus.subscribe((x) => {
		console.log('asf', x);
		input_has_focus = x;
	});
</script>

<!-- <svelte:window on:keydown={(key) => {
	if (input_has_focus != true){
		key_pressed.set([{'key':key.key}])
	}
	
}} /> -->
<svelte:head>
	<link rel="stylesheet" href="{base}/styles.css" />
	<link rel="stylesheet" href="{base}/{prefs.theme_name}.css" />
</svelte:head>
<Styles />
{#if !connected || !db_init}
	<Spinner size="sm" type="grow" />
	{#each Object.entries(connected_relays) as relay}
		<p>Connecting to: {relay}</p>
	{/each}
	<small
		>If this takes too long to enter, remove dead relays from your settings and add more performant
		ones <a
			on:click={() => {
				connected = true;
			}}>enter anyway</a
		>.</small
	>
{:else}
	<div class="submenu" style="position: absolute; top: 10px; left: 10px;">
		<br />
		<a href="/"><Fa style="font-size: 1.5em; color: #1DA1F2;" icon={faDove} /></a>
		<br />
		<br />
		{#each data.sections as section}
			<a href={`${base}/${section.slug}`}>
				{#if section.icon}
					<Fa icon={section.icon} />
				{/if}
				{@html section.title}
			</a>
			<br />
			<br />
		{/each}
		<hr />
	</div>
	<div style={left_style}>
		<slot />
	</div>
	<style>
		a {
			color: black;
			font-size: 1.2em;
			text-decoration: none;
		}
	</style>
{/if}
