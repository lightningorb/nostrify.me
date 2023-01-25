<script lang="ts">
	import db from '$lib/db.coffee';
	import { onDestroy } from 'svelte';
	import { preferences } from '$lib/store.ts';
	import pool from '$lib/pool.ts';
	import { onMount } from 'svelte';
	import Note from './Note.svelte';
	import { key_to_hex_key } from '$lib/key.ts';
	import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap';
	let prefs: any = {},
		isFalse: boolean = false;
	preferences.subscribe((x) => (prefs = x));
	let max: number = 10;
	let entries: any[] = [];
	let intervals: number[] = [];
	export let key: any = null;
	key = key.slice(0, 4) === 'npub' ? key_to_hex_key(key) : key;
	const lim = (): number => {
		let one_hour_ago = Math.floor(Date.now() / 1000) - (prefs?.global_hours || 1) * 3600;
		let last_event = localStorage.last_event ? parseInt(localStorage.last_event) : 0;
		let m = Math.max(one_hour_ago, last_event);
		return m;
	};
	const moar = (): void => {
		max += 10;
		entries = db.get_profile_posts(max, key);
	};
	const event_cb = (ev: any): void => {
		db.insert_data(ev);
	};
	let subs: any[] = [];
	onDestroy(() => {
		for (let intv of intervals) {
			clearInterval(intv);
		}
		for (let s of subs) {
			s[1].unsub();
		}
	});
	onMount(() => {
		entries = db.get_profile_posts(max, key);
		let intervalId = setInterval(() => {
			entries = db.get_profile_posts(max, key);
			db.save();
		}, 1000 * 1);
		intervals.push(intervalId);
		window.addEventListener('scroll', () => {
			if (Math.ceil(window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
				moar();
			}
		});
		subs = pool.sub('profile', { kinds: [1], authors: [key] });
		for (let s of subs) {
			s[1].on('event', event_cb);
		}
	});
</script>

<br />
{#each entries as note (note.id)}
	<Note
		self={note}
		parent={null}
		related={note.related}
		pubkey={note.pubkey}
		created_at={note.created_at}
		tags={note.tags}
		id={note.id}
		content={note.content}
	/>
{/each}
