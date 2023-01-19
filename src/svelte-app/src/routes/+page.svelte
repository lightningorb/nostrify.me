<script lang='coffeescript'>
import { preferences } from '$lib/store.js'
import { connect, print } from '$lib/utils.coffee'
import { onMount } from 'svelte'
import Note from '../components/Note.svelte'
import Post from '../components/Post.svelte'
import { Spinner } from 'sveltestrap'
import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap'
[prefs, pool, connected] = [{}, undefined, false]
preferences.subscribe (x) => prefs = x
onMount ->
  pool = connect()
  pool.on 'open', (relay) =>
    connected = true
    relay.subscribe 'subid',
      kinds: [1],
      since: Math.floor(Date.now() / 1000) - (prefs.global_hours || 1) * 3600
  # pool.on 'eose', (relay) => relay.close()
  pool.on 'event', (relay, sub_id, ev) =>
    prefs.notes[ev.id] = ev
    preferences.set(prefs)
</script>
<br />
{#if pool}
	<Post {pool} />
{/if}
<p>Notes: {Object.entries(prefs.notes).length}</p>
{#if !connected}
	<Spinner size="sm" type="grow" />
{/if}
{#each Object.entries(prefs.notes).sort((a, b) => b[1].created_at - a[1].created_at) as [event_id, event] (event.id)}
	<Note {event} />
{/each}
