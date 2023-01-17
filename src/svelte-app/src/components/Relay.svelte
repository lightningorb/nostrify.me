<script type="text/javascript">
	import { Form, FormGroup, FormText, Label, Input } from 'sveltestrap';
	import { preferences } from '$lib/store.js';
	import { get } from 'svelte/store';
	export let relay;
	export let i;
</script>

<Label for="relay{i}">Relay {i}</Label>
<Input
	type="text"
	name="relay"
	id="relay{i}"
	on:change={() => {
		let p = get(preferences);
		p.relays[i] = relay;
		preferences.set(p);
	}}
	bind:value={relay}
/>
