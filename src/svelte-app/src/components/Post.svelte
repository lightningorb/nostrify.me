<script type="text/javascript">
	import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap';
	import { preferences } from '$lib/store.js';
	import { get } from 'svelte/store';
	let prefs = get(preferences);
	let text = '';
	export let tags = [];
	$: result = {};
	let posting = false;
	async function post() {
		posting = true;
		let event = {
			kind: 1,
			pubkey: prefs.public_key,
			created_at: Math.floor(Date.now() / 1000),
			tags: tags,
			content: text
		};
		for (var i in prefs.relays) {
			event.id = window.NostrTools.getEventHash(event);
			event.sig = window.NostrTools.signEvent(event, prefs.private_key);
			var relay_address = prefs.relays[i];
			const relay = window.NostrTools.relayInit(relay_address);
			await relay.connect(1);
			relay.on('connect', async () => {
				let pub = await relay.publish(event);
				pub.on('ok', () => {
					text = '';
				});
				pub.on('seen', () => {
					console.log(`we saw the event`);
				});
				pub.on('failed', (reason) => {
					console.log(`failed to publish`);
					console.log(reason);
				});
			});
		}
	}
</script>
<FormGroup class="que-pasa">
	{#if !posting}
		<Input
			placeholder="Post something.. go on."
			type="textarea"
			name="text"
			id="exampleText"
			bind:value={text}
			autofocus
		/>
	{/if}
	{#if text}
		<Button on:click|once={() => post()}>Post</Button>
	{/if}
</FormGroup>
