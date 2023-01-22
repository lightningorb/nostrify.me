<script>
	import { print } from '$lib/utils.ts';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import pool from '$lib/pool.ts';
	import Note from '../../components/Note.svelte';
	import db from '$lib/db.coffee';
	import Key from '$lib/Key.ts';
	var note;
	$: key = $page.url.searchParams;

    function get_pubkeys(note){
        var pubkeys = new Set([])
        if (note){
            var in_db = db.get_identity(note.pubkey)
            if (!in_db)
                pubkeys.add(note.pubkey)
            for (var rel of note.related) {
                for (var pk of get_pubkeys(rel)){
                    pubkeys.add(pk)
                }
            }
        }
        return pubkeys
    }

	function get_note(id) {
		var seen = {};
		note = db.get_note(id);
		if (note) get_note_tree(note, 0, seen);
		return note;
	}

	$: note = get_note($page.url.searchParams.get('key'));
	$: pubkeys = get_pubkeys(note)
	var timer = 0;
	var sub_to_ids_timer = 0;

	var debounce = function (id) {
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

	var sub_to_ids_debounce = function (pubkeys) {
		clearTimeout(sub_to_ids_timer);
		sub_to_ids_timer = setTimeout(function () {
			pool.pool.unsubscribe('ids');
			pool.pool.subscribe('ids', {
				kinds: [0],
				authors: [...pubkeys]
			});
		}, 3000);
	};

	function sub_to_note(id) {
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
	$: sub_ids = sub_to_ids_debounce(pubkeys)

	function on_event(relay, sub_id, ev) {
		if (sub_id == 'refs') {
			db.insert_data(ev);
			debounce($page.url.searchParams.get('key'));
		} else if (sub_id == 'note') {
			db.insert_data(ev);
			note = get_note($page.url.searchParams.get('key'));
		} else if (sub_id == 'ids') {
			db.insert_identity_data(ev)
		}
	}

	onDestroy(function() {
		pool.pool.unsubscribe('refs');
		pool.pool.unsubscribe('note');
		pool.pool.unsubscribe('ids');
		pool.remove_event_callback(on_event)
	})

	onMount(function () {
		pool.add_event_callback(on_event)
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
		sig={note.sig}
		content={note.content}
	/>
{/if}
