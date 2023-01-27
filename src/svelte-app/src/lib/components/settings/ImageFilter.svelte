<script lang="ts">
	import { preferences } from '$lib/store.ts';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { Button, Form, FormGroup, FormText, Label, Input } from 'sveltestrap';
	import { Button, Popover } from 'sveltestrap';
	import { Popover } from 'sveltestrap';
	import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/index.js';

	var eval_expression = (expr, base) => {
		return eval(expr);
	};

	$: eval_ = eval_expression();
	let prefs = {};
	preferences.subscribe((x) => (prefs = x));
</script>

<Label for="private_key">Show images on</Label>
<Input
	type="text"
	name="pviate key"
	id="private_key"
	placeholder={'nsec...'}
	on:change={(x) => {
		let p = get(preferences);
		let key = new Key(x.target.value);
		p.private_key = key.as_hex();
		preferences.set(p);
	}}
	value={'global and threads'}
/>

<div class="mt-3">
	<a id="btn-trigger"><Fa icon={faCircleInfo} /></a>
	<Popover trigger="hover" placement="right" target="btn-trigger" title="Example inputs">
		<ul>
			<li>all</li>
			<li>global</li>
			<li>threads</li>
			<li>all and not global</li>
		</ul>
	</Popover>
</div>
