<script lang="coffeescript">
	import { goto } from '$app/navigation';
	import db from '$lib/db.coffee'
	import subs from '$lib/subscriptions.coffee'
	import { key_to_hex_key, hex_key_to_key} from '$lib/key.ts'
	import { print, getRandomInt} from '$lib/utils.ts'
	import { page } from '$app/stores';
	import YTFrame from '../components/YoutubeIframe.svelte'
	import VideoIframe from '../components/VimeoIframe.svelte'
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
	import Time from 'svelte-time'
	import SvelteMarkdown from 'svelte-markdown'
	isOpen = false
	export parent = null
	export parents = []
	export id = null
	export sig = null
	export depth = 0
	export kind = 0
	export content = ''
	export tags = '[]'
	export pubkey = ''
	export created_at = 0
	export related = {}
	show_meta_button = false
	w = 0
	h = 0
	yt = ''
	vimeo = ''
	user_id = null
	makeSafeHtml = (content) ->
		if content? and content != undefined
			imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi
			youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/
			ytre = '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
			m = content.match(youtubeRegex)
			yt = if m then m[0] else m
			vimeoRegex = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/
			m = content.match(vimeoRegex)
			# if m
			# 	vimeo = m[3];
			content = content.replace(imgRegex, '<img src="$1" alt="image">')
			content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
			content = content.replace(/<img/gi, '<img class="img-fluid"')
		content
	`$: source = makeSafeHtml(content)`
	`$: ref = JSON.parse(tags).filter((x) => x[0] == 'e')`
	rand_int = 'id_'+getRandomInt(0, 1e10).toString()
	[is_replying, show_metadata] = [false, false]
	onMount ->
		subs.init()
		if pubkey?
			subs.main(pubkey)
		cmd = () ->
			if pubkey?
				user_id = db.get_identity(pubkey)?.content
				if user_id
					user_id = JSON.parse(user_id)
		setInterval(cmd, 1000)
		cmd()
		isOpen = true
	on_note_click = ->
		$page.url.searchParams.set('key', id)
		goto('/e/?'+$page.url.searchParams.toString())
</script>

<Fade {isOpen} {id}>
	<Card class="mb-0" style={'px; margin-left: ' + 5 + 'px;'}>
		<span class="note-content">
			<span on:click={on_note_click}>
				<CardHeader>
					{#if user_id && user_id.picture}
						<img style="width: 30px; height: 30px; border-radius: 30px;" src={user_id.picture} />
						{user_id.name ? user_id.name : pubkey.slice(0, 5)}
					{/if}
					<Time id={'time' + id} relative live={1000} timestamp={created_at * 1000} />
					{#if user_id}
						{#if user_id.nip05}
							<br /><small>{user_id.nip05}</small>
						{/if}
						{#if user_id.nip05valid}
							<Fa class="small-fa" icon={faCertificate} />
						{/if}
					{/if}
					{#if parent}
						<br /><small>reply to: <a href={'/e/?key=' + parent}>{parent.slice(0, 5)}</a>...</small>
					{:else if ref.length != 0}
						{#each ref as r}
							<br /><small>reply to: <a href={'/e/?key=' + r[1]}>{r[1].slice(0, 5)}</a>...</small>
						{/each}
					{/if}
					{#if show_meta_button}
						<Button class="small-button" id={rand_int} size="sm"
							><Fa class="small-fa" icon={faInfo} /></Button
						>
						<Metadata note_id={id} {kind} id={rand_int} {pubkey} {created_at} {tags} {content} />
					{/if}
				</CardHeader>
				<CardBody>
					<div bind:clientWidth={w} bind:clientHeight={h}>
						<CardText>
							<SvelteMarkdown {source} />
							{#if yt}
								<YTFrame id={yt} width={w} height={w / (16 / 9)} />
							{/if}
							{#if vimeo}
								<VideoIframe id={'33316053'} width={w} height={w / (16 / 9)} />
							{/if}
						</CardText>
					</div></CardBody
				>
			</span>
			<CardFooter>
				<small>User Identity: {pubkey.slice(0, 10)}...</small>
				<br />
				<small>Note Identity: <a href={'/e/?key=' + id}>{id.slice(0, 5)}</a></small>
				<Button class="small-button" size="sm" on:click={() => (is_replying = true)}
					><Fa class="small-fa" icon={faReply} /></Button
				>
				{#if is_replying}
					<Post tags={[...JSON.parse(tags), ['e', id], ['p', pubkey]]} />
				{/if}
			</CardFooter>
		</span>
		{#if depth < 5 && related}
			{#each Object.entries(related) as [_id, note] (note.id)}
				<Note
					parents={[...parents, id]}
					{kind}
					parent={id}
					related={note.related}
					{sig}
					depth={depth + 1}
					pubkey={note.pubkey}
					created_at={note.created_at}
					tags={note.tags}
					id={note.id}
					content={note.content}
				/>
			{/each}
		{/if}
	</Card>
</Fade>

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
