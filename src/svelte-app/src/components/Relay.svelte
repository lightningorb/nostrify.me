<script lang="coffeescript">
  import { Button, Form, FormGroup, FormText, Label, Input, Row, Col } from 'sveltestrap'
  import { preferences } from '$lib/store.js'
  import { get } from 'svelte/store'
  export relay = null
  export i = null
  handleChange = (event) -> preferences.update ({relays, ...rest}) ->
    relays[i] = event.target.value
    {relays: relays, ...rest}
  deleteRelay = ->
    p = get(preferences)
    p.relays.splice i,1
    preferences.set(p)
</script>
<Row>
  <Col xs={6}>
    <Input
      type="text"
      name="relay"
      id="relay{i}"
      on:change={handleChange}
      bind:value={relay}
    />
  </Col>
  <Col xs={6}>
    <Button on:click={deleteRelay}>Delete</Button>
  </Col>
</Row>