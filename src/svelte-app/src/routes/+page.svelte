<script lang='coffeescript'>
import db from '$lib/db.coffee'
import { onDestroy } from 'svelte'
import { preferences} from '$lib/store.js'
import pool from '$lib/pool.coffee'
import { print } from '$lib/utils.coffee'
import { onMount } from 'svelte'
import Note from '../components/Note.svelte'
import Post from '../components/Post.svelte'
import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap'
[prefs] = [{}, false]
preferences.subscribe (x) => prefs = x
max = 10
entries = []
intervals = []
moar = () =>
  max += 10
  entries = db.get_data(max)
onDestroy ->
  for intv in intervals
    clearInterval intv
onMount ->
  entries = db.get_data(max)
  intervalId = setInterval (->
    entries = db.get_data(max)
    db.save()
  ), 1000 * 5
  intervals.push(intervalId)
  window.addEventListener "scroll", =>
    if Math.ceil(window.innerHeight + window.pageYOffset) >= document.body.offsetHeight
      moar()
  pool.add_callback((relay) ->
    relay.subscribe 'subid',
      kinds: [1],
      since: Math.floor(Date.now() / 1000) - (prefs?.global_hours || 1) * 3600
  )
  pool.add_event_callback (relay, sub_id, ev) =>
    db.insert_data(ev)
sotr = (a, b) => b[1].created_at - a[1].created_at
</script>
<br />
<Post/>
{#each entries as event (event.id)}
	<Note {event} />
{/each}
<!-- <Button on:click={moar}>Load moar</Button> -->
