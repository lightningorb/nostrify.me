<script lang="ts">
	import db from '$lib/db.ts';
	import { onDestroy } from 'svelte';
	import { preferences } from '$lib/store';
	import pool from '$lib/pool';
	import { onMount } from 'svelte';
	import Note from './Note.svelte';
	import Post from './Post.svelte';
	import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap';
	export let scroll_event = {};
	let prefs = {};
	export let base = '/e/';
	preferences.subscribe((x) => (prefs = x));
	export let restart = null;
	let max = 10;
	let entries = [];
	let intervals = [];
	const lim = () => {
		let one_hour_ago = Math.floor(Date.now() / 1000) - (prefs?.global_hours || 1) * 3600;
		let last_event = localStorage.last_event ? parseInt(localStorage.last_event) : 0;
		let m = Math.max(one_hour_ago, last_event);
		return m;
	};
	const moar = () => {
		max += 10;
		entries = db.get_data(max);
	};
	const event_cb = (ev) => db.insert_data(ev);
	let subs = [];
	onDestroy(() => {
		for (let intv of intervals) {
			clearInterval(intv);
		}
		for (let s of subs) {
			s[1].unsub();
		}
	});

	let scroll_event_handler = (event) => {
		if (Math.ceil(window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
			moar();
		}
	};

	$: {
		let _ = scroll_event_handler(scroll_event);
	}

	onMount(() => {
		entries = db.get_data(max);
		let intervalId = setInterval(() => {
			entries = db.get_data(max);
			db.save();
		}, 1000 * 1);
		intervals.push(intervalId);
		window.addEventListener('scroll', scroll_event_handler);
		subs = pool.sub('global', { kinds: [1], since: lim() });
		for (let s of subs) {
			s[1].on('event', event_cb);
		}
	});
</script>

<br />
<Post />
{#each entries as note (note.id)}
	<Note
		{base}
		self={note}
		parent={null}
		pubkey={note.pubkey}
		created_at={note.created_at}
		tags={note.tags}
		id={note.id}
		content={note.content}
		is_global={true}
	/>
{/each}
