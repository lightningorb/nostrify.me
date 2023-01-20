<script lang='coffeescript'>
import db from '$lib/db.coffee'
import { onDestroy } from 'svelte'
import { preferences } from '$lib/store.js'
import { connect, print } from '$lib/utils.coffee'
import { onMount } from 'svelte'
import Note from '../components/Note.svelte'
import Post from '../components/Post.svelte'
import { Spinner } from 'sveltestrap'
import { Form, FormGroup, FormText, Input, Label, Button } from 'sveltestrap'
[prefs, pool, connected] = [{}, undefined, false]
preferences.subscribe (x) => prefs = x
max = 10
entries = []
intervals = []
lim = () => Math.floor(Date.now() / 1000) - (prefs?.global_hours || 1) * 3600
onDestroy ->
  for intv in intervals
    clearInterval intv
onMount ->
  db.init()
  entries = db.get_data(max)
  intervalId = setInterval (->
    entries = db.get_data(max)
    db.save()
  ), 1000 * 5
  intervals.push(intervalId)
  window.addEventListener "scroll", =>
    if (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight
      max += 10
      entries = db.get_data(max)
  pool = connect()
  pool.on 'open', (relay) =>
    connected = true
    relay.subscribe 'subid',
      kinds: [1],
      since: lim()
  pool.on 'event', (relay, sub_id, ev) =>
    db.insert_data(ev)
sotr = (a, b) => b[1].created_at - a[1].created_at
</script>
<br />
{#if pool}
	<Post {pool} />
{/if}
<p>Notes: {Object.entries(prefs.notes).length}</p>
{#if !connected}
	<Spinner size="sm" type="grow"/>
{/if}
{#each entries as event (event.id)}
	<Note {event} />
{/each}