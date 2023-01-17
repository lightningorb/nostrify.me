<script>
	import { RelayPool } from 'nostr';
	import { writable } from 'svelte/store';
	import { preferences } from '$lib/store.js';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import Note from '../../../components/Note.svelte';
	import { Spinner } from 'sveltestrap';
	import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap';
	import { browser, dev } from '$app/environment';

	const events = writable({});
	let prefs = get(preferences);
	let relay_address = prefs.relay;
	if (browser && prefs.public_key == '') {
		prefs.private_key = window.NostrTools.generatePrivateKey();
		prefs.public_key = window.NostrTools.getPublicKey(prefs.private_key);
		preferences.set(prefs);
	}
	// $: relays = get(preferences).relays || [];

	let connected = false;
	const pool = RelayPool(prefs.relays);
	pool.on('open', (relay) => {
		connected = true;
		relay.subscribe('subid', {
			kinds: [1],
			'#e': [window.location.pathname.slice(3, window.location.pathname.length)]
		});
	});
	// pool.on('eose', (relay) => relay.close());
	pool.on('event', (relay, sub_id, ev) => {
		events.update((currentValue) => {
			currentValue[ev.id] = ev;
			return currentValue;
		});
	});
</script>

<br />

<p>Notes: {$events.length}</p>
{#if !connected}
	<Spinner size="sm" type="grow" />
{/if}
{#each Object.entries($events).sort((a, b) => b[1].created_at - a[1].created_at) as [event_id, event] (event.id)}
	<Note {event} />
{/each}
