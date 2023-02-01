<script type="ts">
	import { Container, Row, Col } from 'sveltestrap';
	import { Icon } from 'sveltestrap';
	import { Styles } from 'sveltestrap';
	import { page } from '$app/stores';
	import subs from '$lib/subscriptions.ts';
	import SVG from '$lib/components/Svg.svelte';
	import { onMount } from 'svelte';
	import initSqlJs from 'sql.js';
	import db from '$lib/db.ts';
	import { print } from '$lib/utils.ts';
	import { Button } from 'sveltestrap';
	import { Spinner } from 'sveltestrap';
	import Fa from 'svelte-fa/src/fa.svelte';
	import {
		faRightToBracket,
		faRightFromBracket,
		faDove
	} from '@fortawesome/free-regular-svg-icons/index.js';
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
					// left_style = 'padding-left: 10px; padding-right: 10px;';
				} else {
					// left_style = 'padding-left: 50px; padding-right: 10px;';
				}
			});
	});
	// var left_style = 'padding-left: 50px; padding-right: 10px;';
	var left_style = '';
	$: input_has_focus = false;
	input_focus.subscribe((x) => {
		input_has_focus = x;
	});
	$: w = 10000;
	$: h = 0;
	$: xs = w < 135;
</script>

<svelte:head>
	<!-- {#if prefs.theme_name != 'default'} -->
	<!-- {/if} -->
	<link rel="stylesheet" href="{base}/css/styles.css" />
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

<Container>
	<Row>
		<Col xs={1} md={prefs.stack ? 1 : 2}>
				<div bind:clientWidth={w} bind:clientHeight={h}>
					<a href="/"
						><img
							src="/ostrich-svgrepo-com.svg"
							style:width={'30px'}
							style:color="white"
							style="position: relative; top: 5px; left: -5px;"
						/></a
					><br /><br />
					{#each data.sections as section}
						{#if section.callback}
							<a on:click={section.callback()}>
								{#if section.icon}
									<Fa icon={section.icon} />
								{/if}
								{#if section.bsIcon}
									<Icon name={section.bsIcon} />
								{/if}
								{#if !xs}
									{@html section.title}
								{/if}
							</a>
						{:else}
							<a href={`${section.slug}`}>
								{#if section.icon}
									<Fa
										style={$page.url.pathname == section.slug ? 'color: var(--heading-color);' : ''}
										icon={section.icon}
									/>
								{/if}
								{#if section.bsIcon}
									<Icon
										name={section.bsIcon}
										style={$page.url.pathname == section.slug ? 'color: var(--heading-color);' : ''}
									/>
								{/if}
								{#if section.svg}
									<SVG />
								{/if}
								{#if !xs}
									{@html section.title}
								{/if}
							</a>
						{/if}
						<br />
						<br />
					{/each}
					<hr />
				</div>
		</Col>
		<Col xs={11} md={prefs.stack ? 11 : 7}>
			<div style={left_style}>
				<slot />
			</div>
		</Col>
	</Row>
</Container>

{/if}

<style>
	:global(a) {
		color: black;
		font-size: 1.2em;
		text-decoration: none;
	}
</style>