<script lang="coffeescript">
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
lim = () =>
  one_hour_ago = Math.floor(Date.now() / 1000) - (prefs?.global_hours || 1) * 3600
  last_event = if localStorage.last_event? then parseInt(localStorage.last_event) else 0
  m = Math.max(one_hour_ago, last_event)
  return m
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
  ), 1000 * 1
  intervals.push(intervalId)
  window.addEventListener "scroll", =>
    if Math.ceil(window.innerHeight + window.pageYOffset) >= document.body.offsetHeight
      moar()
  # missing = db.get_missing_ids(lim())
  # pool.pool.unsubscribe 'ids'
  # pool.pool.subscribe 'ids',
  #   kinds: [0],
  #   pubkeys: missing
  pool.pool.unsubscribe 'global'
  pool.pool.subscribe 'global',
    kinds: [1],
    since: lim()
  pool.add_event_callback (relay, sub_id, ev) =>
    db.insert_data(ev)
    console.log(ev.id)
sotr = (a, b) => b[1].created_at - a[1].created_at
</script>

<br />
<Post />
{#each entries as note (note.id)}
	<Note
		parent={null}
		related={note.related}
		pubkey={note.pubkey}
		created_at={note.created_at}
		tags={note.tags}
		id={note.id}
		content={note.content}
	/>
{/each}
<!-- <Button on:click={moar}>Load moar</Button> -->
