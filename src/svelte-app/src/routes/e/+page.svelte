<script>
	import { print } from '$lib/utils.coffee';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import pool from '$lib/pool.coffee';
	import Note from '../../components/Note.svelte';
	import db from '$lib/db.coffee';
	import Key from '$lib/Key.coffee';
	var debounce, intervalId, intervals, note, timer;
	$: key = $page.url.searchParams;
	intervals = [];

	function get_note(id) {
		var seen = {};
		note = db.get_note(id);
		if (note) get_note_tree(note, 0, seen);
		return note;
	}

	$: note = get_note($page.url.searchParams.get('key'));
	timer = void 0;

	debounce = function (id) {
		clearTimeout(timer);
		timer = setTimeout(function () {
			db.save();
			note = get_note(id);
		}, 150);
	};

	function get_note_tree(note, depth, seen) {
		var id = note.id;
		if (seen[id]) return;
		seen[id] = true;
		note.related = [];
		var related = db.get_related(id);
		var space = '';
		for (var j = 0; j < depth; j++) space += '  ';
		for (var i = 0; i < related.length; i++) {
			if (!seen[related[i].id]) {
				note.related.push(related[i]);
				get_note_tree(related[i], depth + 1, seen);
			}
		}
	}

	function sub_to_note(id) {
		print('subbing to' + id);
		pool.pool.unsubscribe('note');
		pool.pool.subscribe('note', {
			kinds: [1],
			ids: [id]
		});
	}

	function sub_to_refs(id) {
		pool.pool.unsubscribe('refs');
		pool.pool.subscribe('refs', {
			kinds: [1],
			'#e': [id]
		});
	}

	$: sub = sub_to_note($page.url.searchParams.get('key'));
	$: refs = sub_to_refs($page.url.searchParams.get('key'));

	onMount(function () {
		function on_event(relay, sub_id, ev) {
			db.insert_data(ev);
			if (sub_id == 'refs') {
				debounce($page.url.searchParams.get('key'));
			} else if (sub_id == 'note') {
				note = get_note($page.url.searchParams.get('key'));
			}
		}
		pool.pool.on('event', on_event);
	});
</script>

<br />
<h2>Thread</h2>
<hr />
<br />
{#if note && note.content != undefined}
	<Note
		related={note.related}
		pubkey={note.pubkey}
		created_at={note.created_at}
		tags={note.tags}
		id={note.id}
		content={note.content}
	/>
{/if}
