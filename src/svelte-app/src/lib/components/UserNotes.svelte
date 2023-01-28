<script lang="ts">
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
		entries = window.db.get_profile_posts(max, key);
	};
	const event_cb = (ev: any): void => {
		window.db.insert_data(ev);
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
		entries = window.db.get_profile_posts(max, key);
		let intervalId = setInterval(() => {
			entries = window.db.get_profile_posts(max, key);
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

<span class="profile-notes">
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
</span>

<style>
	:global(.profile-notes) {
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
		display: block;
	}
</style>
