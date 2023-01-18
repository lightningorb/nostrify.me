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
    import { page } from '$app/stores';

	let event_id;
	const events = writable({});
	let connected = false;
	onMount(() => {
		let prefs = get(preferences);
		let relay_address = prefs.relay;
		event_id = $page.params.slug
		const pool = RelayPool(prefs.relays);
		pool.on('open', (relay) => {
			connected = true;
			relay.subscribe('subid', {
				kinds: [1],
				'#e': [event_id]
			});
		});
		pool.on('event', (relay, sub_id, ev) => {
			events.update((currentValue) => {
				currentValue[ev.id] = ev;
				return currentValue;
			});
		});
	})

</script>

<br />

{#if !connected}
	<Spinner size="sm" type="grow" />
{/if}
{#each Object.entries($events).sort((a, b) => b[1].created_at - a[1].created_at) as [event_id, event] (event.id)}
	<Note {event} />
{/each}
