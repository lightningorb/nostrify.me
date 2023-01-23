<script type="text/javascript">
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faInfo } from '@fortawesome/free-solid-svg-icons/index.js';
	import { print, getRandomInt } from '$lib/utils.ts';
	import { Popover } from 'sveltestrap';
	import EmojiPicker from 'svelte-emoji-picker';
	import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap';
	import { preferences } from '$lib/store.ts';
	import { get } from 'svelte/store';
	let prefs = get(preferences);
	let text = '';
	export let tags = [];
	var rand_int = 'id_' + getRandomInt(0, 1e10).toString();
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

<FormGroup class="que-pasa mb-md-4">
	{#if !posting}
		<Input
			placeholder="Post something.. go on."
			type="textarea"
			name="text"
			id="exampleText"
			class="mb-2"
			bind:value={text}
			autofocus
		/>
	{/if}
	<span id={rand_int} style="position: relative; top: 3px; left: 15px; cursor: pointer;">😁</span>
	{#if text}
		<Button class="float-end" on:click|once={() => post()}>Post</Button>
	{:else}
		<Button class="float-end" on:click|once={() => post()} disabled>Post</Button>
	{/if}
</FormGroup>

<Popover class="meta-popover" target={rand_int}>
	<EmojiPicker bind:value={text} />
</Popover>
