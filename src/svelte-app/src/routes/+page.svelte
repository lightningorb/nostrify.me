<script>
	import { writable } from 'svelte/store';
	import { preferences } from '$lib/store.js';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import Note from '../components/Note.svelte';
	import Post from '../components/Post.svelte';
	import { RelayPool } from 'nostr';
	import { Spinner } from 'sveltestrap';
	import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap';
	import { browser, dev } from '$app/environment';
	let prefs = get(preferences);
	let relay_address = prefs.relay;
	if (browser && prefs.public_key == '') {
		prefs.private_key = window.NostrTools.generatePrivateKey();
		prefs.public_key = window.NostrTools.getPublicKey(prefs.private_key);
		preferences.set(prefs);
	}
	let connected = false;
	const pool = RelayPool(prefs.relays);
	pool.on('open', (relay) => {
		connected = true;
		relay.subscribe('subid', {
			kinds: [1],
			since: Math.floor(Date.now() / 1000) - 3600
		});
	});
	// pool.on('eose', (relay) => relay.close());
	pool.on('event', (relay, sub_id, ev) => {
		prefs.notes[ev.id] = ev;
		preferences.set(prefs);
	});
</script>

<br />
<Post {pool} />
<p>Notes: {Object.entries(prefs.notes).length}</p>
{#if !connected}
	<Spinner size="sm" type="grow" />
{/if}
{#each Object.entries(prefs.notes).sort((a, b) => b[1].created_at - a[1].created_at) as [event_id, event] (event.id)}
	<Note {event} />
{/each}
