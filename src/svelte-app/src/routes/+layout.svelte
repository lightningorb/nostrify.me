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
	import { preferences } from '$lib/store.js';
	import { Styles } from 'sveltestrap';
	import { Col, Container, Row } from 'sveltestrap';
	import { get } from 'svelte/store';
	import { pool as store_pool } from '$lib/store.js';
	import pool from '$lib/pool.ts';
	var p = pool.init();
	store_pool.set(p);
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
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="{base}/{prefs.theme_name}.css" />
</svelte:head>
<Styles />

{#if !connected}
	<Spinner size="sm" type="grow" />
{/if}
{#if db_init}
	<Container>
		<Row cols={2}>
			<Col xs={1}>
				<div class="submenu">
					<br />
					<Fa style="font-size: 2em; color: #1DA1F2;" icon={faDove} />
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
			</Col>
			<Col xs={11}>
				<slot />
			</Col>
		</Row>
	</Container>
	<br />

	<!-- <Footer /> -->
	<style>
		a {
			color: black;
			font-size: 1.2em;
			text-decoration: none;
		}
	</style>
{/if}
