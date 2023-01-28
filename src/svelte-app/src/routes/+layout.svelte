<script type="ts">
	import { Styles } from 'sveltestrap';

	import subs from '$lib/subscriptions.ts';
	import { onMount } from 'svelte';
	import initSqlJs from 'sql.js';
	import db from '$lib/db.ts';
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
		var SQL = await initSqlJs({ locateFile: (file) => `/${file}` });
		db.init(SQL);
		db_init = true;
		window.db = db;
	}
	onMount(() => {
		subs.nip05_timer();
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
		input_has_focus = x;
	});
</script>

<svelte:head>
	{#if prefs.theme_name != 'default'}
		<link rel="stylesheet" href="{base}/css/styles.css" />
	{/if}
	<link rel="stylesheet" href="{base}/css/{prefs.theme_name}.css" />
</svelte:head>

<Styles />

{#if !connected || !db_init}
	<Spinner size="sm" type="grow" />
	{#each Object.entries(connected_relays) as relay}
		<p>Connecting to: {relay}</p>
	{/each}
	<small
		>If this takes too long to enter, remove dead relays from your settings and add more performant
		ones <span style="font-size: 1.5em; text-decoration: underline"
			><a
				on:click={() => {
					connected = true;
				}}>enter anyway</a
			></span
		>.</small
	>
{:else}
	<div class="submenu" style="position: absolute; top: 10px; left: 10px;">
		{#each data.sections as section}
			{#if section.callback}
				<a on:click={section.callback()}>
					{#if section.icon}
						<Fa icon={section.icon} />
					{/if}
					{@html section.title}
				</a>
			{:else}
				<a href={`${base}/${section.slug}`}>
					{#if section.icon}
						<Fa icon={section.icon} />
					{/if}
					{@html section.title}
				</a>
			{/if}
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
