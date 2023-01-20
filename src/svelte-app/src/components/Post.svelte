<script type="text/javascript">
	import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap';
	import { preferences } from '$lib/store.js';
	import { get } from 'svelte/store';
	let prefs = get(preferences);
	let text = '';
	async function post() {
		let event = {
			kind: 1,
			pubkey: prefs.public_key,
			created_at: Math.floor(Date.now() / 1000),
			tags: [],
			content: text
		};
		event.id = window.NostrTools.getEventHash(event);
		event.sig = window.NostrTools.signEvent(event, prefs.private_key);
		for (var i in prefs.relays) {
			var relay_address = prefs.relays[i];
			const relay = window.NostrTools.relayInit(relay_address);
			await relay.connect();
			relay.on('connect', async () => {
				let pub = await relay.publish(event);
				pub.on('ok', () => {
					text = '';
				});
				pub.on('seen', () => {
					console.log(`we saw the event `);
				});
				pub.on('failed', (reason) => {
					console.log(`failed to publish`);
				});
			});
		}
	}
</script>

<FormGroup class="que-pasa">
	<Input
		placeholder="Post something.. go on."
		type="textarea"
		name="text"
		id="exampleText"
		bind:value={text}
	/>
	{#if text}
		<Button on:click={post}>Post</Button>
	{/if}
</FormGroup>
