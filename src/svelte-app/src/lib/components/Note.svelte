<script lang="ts">
	import NoteContent from './NoteContent.svelte';
	import { preferences, input_focus, key_pressed } from '$lib/store.ts';
	import { goto } from '$app/navigation';
	import subs from '$lib/subscriptions.ts';
	import { key_to_hex_key, hex_key_to_key } from '$lib/key.ts';
	import { print, getRandomInt, breakLongWords } from '$lib/utils.ts';
	import { page } from '$app/stores';
	import Avatar from '$lib/components/Avatar.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import Post from '$lib/components/Post.svelte';
	import Note from '$lib/components/Note.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import { faReply, faInfo, faCertificate } from '@fortawesome/free-solid-svg-icons/index.js';
	import { Card, Button, CardText, CardBody, CardFooter, CardHeader, Fade } from 'sveltestrap';
	import { onMount, onDestroy } from 'svelte';
	import Time from '$lib/components/Time.svelte';

	let isOpen = false;
	export let is_global = false;
	export let base = '/e/';
	export let parent = null;
	export let self = null;
	export let restart = null;
	export let parents = [];
	export let id = null;
	export let sig = null;
	export let depth = 0;
	export let kind = 0;
	export let content = '';
	export let tags = '[]';
	export let pubkey = '';
	export let created_at = 0;
	let show_meta_button = false;
	let w = 0;
	let h = 0;
	let yt = '';
	let user_id = null;
	let ref = JSON.parse(tags).filter((x) => x[0] == 'e');
	let rand_int = 'id_' + getRandomInt(0, 1e10).toString();
	let [is_replying, show_metadata] = [false, false];

	var prefs = {};
	preferences.subscribe((x) => (prefs = x));
	let interval = 0;
	$: show_account =
		prefs.show_unverified_accounts == true ||
		(prefs.show_unverified_accounts == false && user_id && user_id.nip05valid);

	onMount(async () => {
		if (pubkey && !window.db.get_profile(pubkey)?.nip05checked) {
			await subs.main(pubkey);
		}
		let cmd = () => {
			if (pubkey) {
				user_id = window.db.get_profile(pubkey);
			}
		};
		interval = setInterval(cmd, 1000);
		cmd();
		isOpen = true;
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	let on_note_click = () => {
		$page.url.searchParams.set('key', id);
		goto(base + '?' + $page.url.searchParams.toString());
	};

	key_pressed.subscribe((x: any) => {
		if (self.active) {
			let key = x[0].key;
			if (key === 'j') {
				let next = self.next;
				if (next) {
					$page.url.searchParams.set('key', next.id);
					goto(base + '?' + $page.url.searchParams.toString());
				}
			} else if (key === 'k') {
				let prev = self.prev || ref?.[ref.length - 1][1];
				if (prev) {
					$page.url.searchParams.set('key', prev);
					goto(base + '?' + $page.url.searchParams.toString());
				}
			}
		}
	});
</script>

{#if show_account}
	<Card
		style={'px; margin-left: ' + 5 + 'px; padding-top: 5px; padding-left: 5px; padding-right: 5px;'}
	>
		<span class={'note-content'}>
			<div on:click={on_note_click} style="margin: 0px; padding: 0px;">
				<a href={'/u/?key=' + pubkey}>
					<Avatar
						src={(user_id && user_id.picture) || null}
						alt={(user_id && user_id.name) || rand_int}
						{is_global}
					/>
					{#if user_id}
						{user_id.name ? user_id.name : pubkey.slice(0, 5)}
					{/if}
					<Time utc={created_at} />
					{#if user_id}
						{#if user_id.nip05}
							<br /><small>{user_id.nip05}</small>
						{/if}
						{#if user_id.nip05valid}
							<Fa class="small-fa" style="font-size: 0.7em;" icon={faCertificate} />
						{/if}
					{/if}
				</a>
				{#if parent}
					<br /><small
						>reply to: <a href={base + '?key=' + parent}>{parent.slice(0, 5)}</a>...</small
					>
				{:else if ref.length != 0}
					{#each ref as r}
						<br /><small>reply to: <a href={base + '?key=' + r[1]}>{r[1].slice(0, 5)}</a>...</small>
					{/each}
				{/if}
				{#if show_meta_button}
					<Button class="small-button" id={rand_int} size="sm"
						><Fa class="small-fa" icon={faInfo} /></Button
					>
					<Metadata
						{sig}
						note_id={id}
						{kind}
						id={rand_int}
						{pubkey}
						{created_at}
						{tags}
						{content}
					/>
				{/if}
				<!-- 			{#if yt}
				<div bind:clientWidth={w} bind:clientHeight={h}>
					<NoteContent source={content} />
					<YTFrame id={yt} width={w} height={w / (16 / 9)} />
				</div>
			{:else} -->
				<NoteContent {is_global} source={content} />
				<!-- {/if} -->
			</div>
			<Button class="small-button" size="sm" on:click={() => (is_replying = true)}
				><Fa class="small-fa" icon={faReply} /></Button
			>
			<br />
			<br />
			{#if is_replying}
				<Post tags={[...JSON.parse(tags), ['e', id], ['p', pubkey]]} />
			{/if}
		</span>
		{#if depth < 5 && self.related}
			{#each Object.entries(self.related) as [_id, note] (note.id)}
				<Note
					parents={[...parents, id]}
					{kind}
					{base}
					parent={id}
					self={note}
					parent_note={self}
					{sig}
					depth={depth + 1}
					pubkey={note.pubkey}
					created_at={note.created_at}
					tags={note.tags}
					id={note.id}
					content={note.content}
					{restart}
				/>
			{/each}
		{/if}
	</Card>

	<style>
		:global(.small-button) {
			border: unset;
			height: 18px;
			width: 18px;
			border-radius: 15px;
			padding: 0px;
			margin: 0px;
		}
		:global(.small-fa) {
			font-size: 0.6em;
			position: relative;
			top: -3px;
		}
		:global(.meta-popover) {
			width: 80%;
			max-width: 80%;
		}
	</style>
{/if}
