<script>
	import { preferences, input_focus, key_pressed } from '$lib/store.ts';
	import { print } from '$lib/utils.ts';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import pool from '$lib/pool.ts';
	import Note from './Note.svelte';
	import Key from '$lib/Key.ts';
	var note;
	export var restart;
	export var base;
	$: key = new Key($page.url.searchParams.get('key') || '');
	import { afterNavigate } from '$app/navigation';

	afterNavigate((x) => {
		console.log('nav');
		restart();
	});

	function get_note(id) {
		var seen = new Set([]);
		note = window.db.get_note(id.as_hex());
		if (note) get_note_tree(note, 0, seen);
		return note;
	}

	var timer = 0;

	var debounce = function (id) {
		clearTimeout(timer);
		timer = setTimeout(function () {
			window.db.save();
			note = get_note(id);
		}, 1000);
	};
	function get_note_tree(note, depth, seen, parent) {
		var id = note.id;
		if (seen.has(id) || depth > 5) return;
		seen.add(id);
		note.related = [];
		note.parent = parent;
		var related = window.db.get_related(id);
		var prev = note;
		for (var i = 0; i < related.length; i++) {
			if (!seen.has(related[i].id)) {
				if (prev == note) note.next = related[i];
				related[i].prev = prev;
				if (related[i] + 1) related[i].next = related[i + 1];
				prev = related[i];
				note.related.push(related[i]);
				get_note_tree(related[i], depth + 1, seen, note);
			}
		}
	}

	function on_event(ev) {
		window.db.insert_data(ev);
		note = get_note(key);
	}

	var subs = [];
	var refs = [];

	onDestroy(function () {
		for (var s of subs) s[1].unsub();
		for (var s of refs) s[1].unsub();
	});

	onMount(function () {
		note = get_note(key);
		subs = pool.sub('note', { kinds: [1], ids: [key.as_hex()] });
		for (var s of subs)
			s[1].on('event', (ev) => {
				window.db.insert_data(ev);
				note = get_note(key);
			});
		refs = pool.sub('refs', { kinds: [1], '#e': [key.as_hex()] });
		for (var s of refs)
			s[1].on('event', (ev) => {
				window.db.insert_data(ev);
				debounce(key);
			});
	});
</script>

<br />
<h2>Thread</h2>
<hr />
<br />
{#if note && note.content != undefined}
	<Note
		{base}
		self={note}
		related={note.related}
		active={note.active}
		pubkey={note.pubkey}
		created_at={note.created_at}
		tags={note.tags}
		id={note.id}
		sig={note.sig}
		content={note.content}
		{restart}
	/>
{/if}
<hr class="mt-0" style="margin-left: 5px;" />
