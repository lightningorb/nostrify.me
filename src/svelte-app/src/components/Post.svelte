<script type="text/javascript">
	import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap';
	import { preferences } from '$lib/store.js';
	import { get } from 'svelte/store';
	let prefs = get(preferences);
	let text = '';
	export let relay;
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
		let pub = relay.publish(event);
		pub.on('ok', () => {
			text = '';
		});
		pub.on('seen', () => {
			console.log(`we saw the event on ${relay.url}`);
		});
		pub.on('failed', (reason) => {
			console.log(`failed to publish to ${relay.url}: ${reason}`);
		});
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
