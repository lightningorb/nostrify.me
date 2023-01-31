<script lang="ts">
	import { saveAs } from 'file-saver';
	import JSZip from 'jszip';
	import { get } from 'svelte/store';
	import Key from '$lib/key.ts';
	import {
		Container,
		Row,
		Col,
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardSubtitle,
		CardText,
		CardTitle,
		Label,
		Input
	} from 'sveltestrap';
	import { onMount } from 'svelte';
	import { preferences } from '$lib/store.ts';

	let prefs = {};
	preferences.subscribe((x) => (prefs = x));

	let set_key = (x) => {
		let p = get(preferences);
		if (x == '') {
			p.public_key = '';
			p.private_key = '';
			preferences.set(p);
			return;
		}
		let k = new Key(x);
		if (k.is_npub()) {
			p.public_key = k.as_hex();
			p.private_key = '';
		} else if (k.is_nsec()) {
			p.private_key = k.as_hex();
			p.public_key = window.NostrTools.getPublicKey(k.as_hex());
		}
		preferences.set(p);
	};

	let set_public_key = (x) => {
		let p = get(preferences);
		let k = new Key(x);
		p.public_key = k.as_hex();
		preferences.set(p);
	};

	let set_private_key = (x) => {
		let p = get(preferences);
		let k = new Key(x);
		p.private_key = k.as_hex();
		preferences.set(p);
	};
</script>

<Card class="mb-0">
	<CardHeader>
		<CardTitle>Keys</CardTitle>
	</CardHeader>
	<CardBody>
		<Input
			type="text"
			name="Key"
			id="key"
			placeholder={'npub... or nsec...'}
			on:change={(x) => set_key(x.target.value)}
			value={prefs.public_key != '' ? new Key(prefs.public_key).as_npub() : ''}
		/>
		<br />
		{#if prefs.private_key}
			<p>We have your private key.</p>
			<p>{new Key(prefs.private_key).as_nsec()}</p>
		{/if}
		{#if prefs.private_key}
			<Button
				on:click={async () => {
					saveAs(
						new Blob(
							[
								`Public: ${new Key(prefs.public_key).as_npub()}\nPrivate: ${new Key(
									prefs.private_key
								).as_nsec()}\n`
							],
							{ type: 'text/plain;charset=utf-8' }
						),
						'nostr_keys.txt'
					);
				}}>Download backup.</Button
			>
		{/if}
	</CardBody>
</Card>
