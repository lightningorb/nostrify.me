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
	import { preferences } from '$lib/store.ts';
	import { Styles } from 'sveltestrap';
	import { Col, Container, Row } from 'sveltestrap';
	import { get } from 'svelte/store';
	import pool from '$lib/pool.ts';
	pool.init();
	export let data = null;
	let prefs = {};
	preferences.subscribe((x) => (prefs = x));
	let connected = false;
	let db_init = false;
	pool.add_callback((relay, sub_id, ev) => (connected = true));
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
</script>

<svelte:head>
	<link rel="stylesheet" href="{base}/styles.css" />
	<link rel="stylesheet" href="{base}/{prefs.theme_name}.css" />
</svelte:head>
<Styles />

{#if !connected}
	<Spinner size="sm" type="grow" />
{/if}
{#if db_init}
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
