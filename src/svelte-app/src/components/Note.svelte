<script lang="coffeescript">
	import NoteContent from './NoteContent.svelte'
	import { preferences, input_focus, key_pressed } from '$lib/store.ts';
	import { goto } from '$app/navigation';
	import db from '$lib/db.ts'
	import subs from '$lib/subscriptions.ts'
	import { key_to_hex_key, hex_key_to_key} from '$lib/key.ts'
	import { print, getRandomInt, breakLongWords } from '$lib/utils.ts'
	import { page } from '$app/stores';
	import YTFrame from '../components/YoutubeIframe.svelte'
	import VideoIframe from '../components/VimeoIframe.svelte'
	import Avatar from '../components/Avatar.svelte'
	import Fa from 'svelte-fa/src/fa.svelte'
	import Post from '../components/Post.svelte'
	import Note from '../components/Note.svelte'
	import Metadata from '../components/Metadata.svelte'
	import { faReply, faInfo, faCertificate } from '@fortawesome/free-solid-svg-icons/index.js'
	import {
	  Card,
	  Button,
	  CardText,
	  CardBody,
	  CardFooter,
	  CardHeader,
	  Fade
	} from 'sveltestrap'
	import { onMount } from 'svelte'
	import Time from '../components/Time.svelte'
	isOpen = false
	export base = '/e/'
	export parent = null
	export self = null
	export restart = null
	export parents = []
	export id = null
	export sig = null
	export depth = 0
	export kind = 0
	export content = ''
	export tags = '[]'
	export pubkey = ''
	export created_at = 0
	show_meta_button = false
	w = 0
	h = 0
	yt = ''
	vimeo = ''
	user_id = null
	user_doc = null
	`$: ref = JSON.parse(tags).filter((x) => x[0] == 'e')`
	rand_int = 'id_'+getRandomInt(0, 1e10).toString()
	[is_replying, show_metadata] = [false, false]
	onMount ->
		if pubkey?
			subs.main(pubkey)
		cmd = () ->
			if pubkey?
				user_doc = db.get_identity(pubkey)?
				user_id = db.get_identity(pubkey)?.content
				if user_id
					user_id = JSON.parse(user_id)
		setInterval(cmd, 1000)
		cmd()
		isOpen = true
	on_note_click = ->
		$page.url.searchParams.set('key', id)
		goto(base+'?'+$page.url.searchParams.toString())
	key_pressed.subscribe((x) ->
		if self.active
			key = x[0].key;
			if key == 'j'
				next = self.next
				if next?
					$page.url.searchParams.set('key', next.id)
					goto(base+'?'+$page.url.searchParams.toString())
			else if key == 'k'
				prev = self.prev or ref?[ref.length-1][1]
				if prev
					$page.url.searchParams.set('key', prev)
					goto(base+'?'+$page.url.searchParams.toString())
	)
</script>

<Card
	style={'px; margin-left: ' + 5 + 'px; padding-top: 5px; padding-left: 5px; padding-right: 5px;'}
>
	<span class={'note-content'}>
		<div on:click={on_note_click} style="margin: 0px; padding: 0px;">
			<a href={'/profile/?key=' + pubkey}>
				<Avatar
					src={(user_id && user_id.picture) || null}
					alt={(user_id && user_id.name) || rand_int}
				/>
				{#if user_id}
					{user_id.name ? user_id.name : pubkey.slice(0, 5)}
				{/if}
				<Time id={'time' + id} utc={created_at} />
				{#if user_id}
					{#if user_id.nip05}
						<br /><small>{user_id.nip05}</small>
					{/if}
					{#if user_id.nip05valid}
						<Fa class="small-fa" icon={faCertificate} />
					{/if}
				{/if}
			</a>
			{#if parent}
				<br /><small>reply to: <a href={base + '?key=' + parent}>{parent.slice(0, 5)}</a>...</small>
			{:else if ref.length != 0}
				{#each ref as r}
					<br /><small>reply to: <a href={base + '?key=' + r[1]}>{r[1].slice(0, 5)}</a>...</small>
				{/each}
			{/if}
			{#if show_meta_button}
				<Button class="small-button" id={rand_int} size="sm"
					><Fa class="small-fa" icon={faInfo} /></Button
				>
				<Metadata {sig} note_id={id} {kind} id={rand_int} {pubkey} {created_at} {tags} {content} />
			{/if}
			<!-- 			{#if yt}
				<div bind:clientWidth={w} bind:clientHeight={h}>
					<NoteContent source={content} />
					<YTFrame id={yt} width={w} height={w / (16 / 9)} />
				</div>
			{:else} -->
			<NoteContent source={content} />
			<!-- {/if} -->
		</div>
		<!-- <small>User Identity: {pubkey.slice(0, 10)}...</small> -->
		<!-- <br /> -->
		<!-- <small>Note Identity: <a href={'/?key=' + id}>{id.slice(0, 5)}</a></small> -->
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
