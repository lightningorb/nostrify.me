<script lang='coffeescript'>
    import { print } from '$lib/utils.coffee'
    import pool from '$lib/pool.coffee'
    import { page } from '$app/stores'
    import { RelayPool } from 'nostr';
    import { writable } from 'svelte/store';
    import { preferences } from '$lib/store.js';
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';
    import Note from '../../components/Note.svelte';
    import { Spinner } from 'sveltestrap';
    import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap';
    import { browser, dev } from '$app/environment';
    import db from '$lib/db.coffee'
    id = $page.url.searchParams.get('id')
    events = db.get_related(id)
    onMount ->
      pool.add_callback((relay) ->
        relay.subscribe 'subid',
          kinds: [1],
          '#e': [id]
      )
      pool.pool.on('event', (relay, sub_id, ev) =>
        db.insert_data(ev)
      );
</script>

<br/>
<h2>Thread</h2>
<hr/>
<br/>
{#each events as event}
    <Note {event} />
{/each}