<script lang="coffeescript">
  import { Button, Form, FormGroup, FormText, Label, Input, Row, Col } from 'sveltestrap'
  import { key_to_hex_key, hex_key_to_key} from '$lib/key.ts'
  import { print } from '$lib/utils.ts'
  import { bech32, fromWords } from '$lib/bech32.ts'
  key = ''
  hex_key = ''
  prefix = ''
</script>

<br />
<br />
<br />
<br />
<br />
<h1>Key Converter</h1>

<p>Convert a key to an old-style hex key</p>

<!-- <Container> -->
<Row>
	<Col>
		<Form>
			<FormGroup>
				<Label for="key">Key</Label>
				<Input
					plaintext
					placeholder="npub or nsec..."
					on:input={(e) => {
						var v = key_to_hex_key(e.target.value);
						hex_key = v;
						prefix = e.target.value.slice(0, 4);
					}}
					bind:value={key}
				/>
			</FormGroup>
			<FormGroup>
				<Label for="val">Prefix</Label>
				<Input
					plaintext
					placeholder="prefix"
					on:input={(e) => {
						prefix = e.target.value;
						key = hex_key_to_key(prefix, hex_key);
					}}
					bind:value={prefix}
				/>
			</FormGroup>
			<FormGroup>
				<Label for="val">Hex Key</Label>
				<Input
					plaintext
					placeholder="hey key..."
					on:input={(e) => {
						hex_key = e.target.value;
						key = hex_key_to_key(prefix, hex_key);
					}}
					bind:value={hex_key}
				/>
			</FormGroup>
		</Form>
	</Col>
</Row>
<!-- </Container> -->
