<script lang='coffeescript'>
  import { Button, Form, FormGroup, FormText, Label, Input, Row, Col } from 'sveltestrap'
  import { key_to_hex_key, hex_key_to_key} from '$lib/key.js'
  import { print } from '$lib/utils.coffee'
  import { bech32, fromWords } from '$lib/bech32.js'
  key = ''
  hex_key = ''
</script>
<br/>
<br/>
<br/>
<br/>
<br/>
<h1>Key Converter</h1>

<p>Convert a key to an old-style hex key</p>

<!-- <Container> -->
  <Row>
    <Col>
        <Form>
            <FormGroup>
                <Label for="key">Key</Label>
                <Input plaintext placeholder='npub or nsec...' on:input={(e) => {
                    hex_key = key_to_hex_key(e.target.value)
                }
                } bind:value={key} />
            </FormGroup>
            <FormGroup>
                <Label for="val">Hex Key</Label>
                <Input plaintext placeholder='hey key...' on:input={(e) => {
                    key = hex_key_to_key(e.target.value)
                }} bind:value={hex_key} />
            </FormGroup>
        </Form>
    </Col>
  </Row>
<!-- </Container> -->