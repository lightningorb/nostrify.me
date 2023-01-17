<script>
	import { writable } from 'svelte/store';
	import { preferences } from '$lib/store.js';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import Note from '../components/Note.svelte';
	import Post from '../components/Post.svelte';
	import { Spinner } from 'sveltestrap';
	import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap';
	import { browser, dev } from '$app/environment';
	const events = writable([]);
	let prefs = get(preferences);
	let relay_address = prefs.relay;
	if (browser && prefs.public_key == '') {
		prefs.private_key = window.NostrTools.generatePrivateKey();
		prefs.public_key = window.NostrTools.getPublicKey(prefs.private_key);
		preferences.set(prefs);
	}
	const relay = browser && window.NostrTools.relayInit(relay_address);
	let connected = false;
	async function connect() {
		await relay.connect();
		relay.on('connect', async () => {
			let sub = relay.sub([
				{
					kinds: [1],
					// authors: [prefs.public_key],
					since: Math.floor(Date.now() / 1000)-(3600)
				}
			]);
			sub.on('event', (event) => {
				// console.log(event);
				events.update((currentValue) =>
					[...currentValue, event].sort((a, b) => b.created_at - a.created_at)
				);
			});
			sub.on('eose', () => {
				// sub.unsub()
			});

			connected = true;
		});
		relay.on('error', () => {
			connected = false;
		});
	}
	onMount(async () => {
		await connect();
	});
</script>
<br />
<Post {relay} />
<p>Notes: {$events.length}</p>
<p>Relay: {relay_address} {connected ? 'connected' : 'disconnected'}</p>
{#if !connected}
	<Spinner size="sm" type="grow" />
{/if}
{#each $events as event (event.id)}
	<Note {event} />
{/each}