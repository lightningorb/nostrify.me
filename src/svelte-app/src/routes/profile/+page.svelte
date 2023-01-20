<script lang='coffee'>
	import { print } from '$lib/utils.coffee';
	import { preferences } from '$lib/store.js'
	import { get } from 'svelte/store'
	import { Button, Form, FormGroup, FormText, Label, Input } from 'sveltestrap'
	import Relay from '../../components/Relay.svelte'
	import ThemeSelector from '../../components/ThemeSelector.svelte'
	prefs = {}
	preferences.subscribe (x) -> prefs = x
	global_hours = prefs.global_hours
	clear_notes = () => preferences.update ({notes, ...rest}) -> {notes: {}, ...rest}
	clear_prefs = () => delete localStorage.preferences
	add_relay = () => preferences.update ({relays, ...rest}) ->
		relays.push('')
		{relays, ...rest}
</script>
<h1>Profile</h1><br />
<!-- <Button on:click={clear_notes}>Clear message cache</Button> -->
<!-- <br/> -->
<!-- <hr/> -->
<ThemeSelector/>
<hr/>
<Label for="global_hours">Hours of global to get</Label>
<Input
	type="text"
	id="global_hours"
	placeholder='1'
	on:change={() => {
		let p = get(preferences);
		p.global_hours = global_hours;
		preferences.set(p);
	}}
	bind:value={global_hours}
/>

<hr/>

<Label for="public_key">Public Key</Label>
<Input
	type="text"
	name="pubic key"
	id="public_key"
	placeholder={prefs.public_key}
	on:change={(x) => {
		let p = get(preferences);
		p.public_key = x.target.value;
		preferences.set(p);
	}}
	bind:value={prefs.public_key}
/>
<Label for="private_key">Private Key</Label>
<Input
	type="text"
	name="pviate key"
	id="private_key"
	placeholder={prefs.private_key}
	on:change={(x) => {
		let p = get(preferences);
		p.private_key = x.target.value;
		preferences.set(p);
	}}
	bind:value={prefs.private_key}
/>

<hr/>

<Button on:click={add_relay}>Add Relay</Button>

<FormGroup>
	{#each prefs.relays as relay, i}
		<Relay {relay} {i} />
	{/each}
	<hr />
</FormGroup>

<p>If things seem broken, try this:</p>
<Button on:click={clear_prefs}>Clear all prefs</Button>
<br />
<hr/>
