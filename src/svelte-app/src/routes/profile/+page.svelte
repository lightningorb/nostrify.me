<script>
	import { preferences } from '$lib/store.js';
	import { get } from 'svelte/store';
	import { Form, FormGroup, FormText, Label, Input } from 'sveltestrap';
	import Relay from '../../components/Relay.svelte';
	import ThemeSelector from '../../components/ThemeSelector.svelte';
	$: relays = get(preferences).relays || [];
	$: public_key = get(preferences).public_key;
	$: private_key = get(preferences).private_key;

</script>

<h1>Profile</h1>
<br />

<ThemeSelector/>

<hr/>

<Label for="public_key">Public Key</Label>
<Input
	type="text"
	name="pubic key"
	id="public_key"
	placeholder={public_key}
	on:change={() => {
		let p = get(preferences);
		p.public_key = public_key;
		preferences.set(p);
	}}
	bind:value={public_key}
/>
<Label for="private_key">Private Key</Label>
<Input
	type="text"
	name="pviate key"
	id="private_key"
	placeholder={private_key}
	on:change={() => {
		let p = get(preferences);
		p.private_key = private_key;
		preferences.set(p);
	}}
	bind:value={private_key}
/>

<hr/>

<FormGroup>
	{#each relays as relay, i}
		<Relay {relay} {i} />
	{/each}
	<hr />
</FormGroup>

