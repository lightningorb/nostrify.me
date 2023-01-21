<script lang="coffeescript">
	import { key_to_hex_key, hex_key_to_key} from '$lib/key.coffee'
	import { print, getRandomInt} from '$lib/utils.coffee'
	import Fa from 'svelte-fa/src/fa.svelte'
	import Post from '../components/Post.svelte'
	import Note from '../components/Note.svelte'
	import Metadata from '../components/Metadata.svelte'
	import { faReply, faInfo } from '@fortawesome/free-solid-svg-icons/index.js'
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
	export depth = 0
	export kind = 0
	export content = ''
	export tags = '[]'
	export pubkey = ''
	export created_at = 0
	export related = {}
	makeSafeHtml = (content) ->
		if content? and content != undefined
			imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi
			content = content.replace(imgRegex, '<img src="$1" alt="image">')
			content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
			content = content.replace(/<img/gi, '<img class="img-fluid"')
		content
	`$: source = makeSafeHtml(content)`
	`$: ref = JSON.parse(tags).filter((x) => x[0] == 'e')`
	rand_int = 'id_'+getRandomInt(0, 1e10).toString()
	is_replying = false
	show_metadata = false
	onMount ->
		isOpen = true
</script>
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
<Fade {isOpen} id={id}>
	<Card class="mb-3" style={"padding-left: "+5+"px; margin-left: "+5+'px;'}>
		<CardHeader>
			<Time id={'time' + id} relative live={1000} timestamp={created_at * 1000} />
			{#if parent}
				<br/><small>In reply to: <a href={'/e/?key=' + parent}>{parent.slice(0, 5)}</a>...</small>
			{:else}
				{#if ref.length != 0}
					{#each ref as r}
						<br/><small>In reply to: <a href={'/e/?key=' + r[1]}>{r[1].slice(0, 5)}</a>...</small>
					{/each}
				{/if}
			{/if}
			<Button class='small-button' id={rand_int} size='sm' ><Fa class='small-fa' icon={faInfo}/></Button>
			<Metadata note_id={id} kind={kind} id={rand_int} pubkey={pubkey} created_at={created_at} tags={tags} content={content}/>
		</CardHeader>
		<CardBody>
			<CardText>
				<SvelteMarkdown {source} />
			</CardText>
		</CardBody>
		<CardFooter>
			<small>User Identity: {pubkey.slice(0, 10)}...</small>
			<br />
			<small>Note Identity: <a href={'/e/?key='+id}>{id.slice(0, 5)}</a></small>
			<Button class='small-button' size='sm' on:click={() => is_replying = true}><Fa class='small-fa' icon={faReply}/></Button>
		{#if is_replying}
			<Post tags={[...JSON.parse(tags), ['e', id], ['p', pubkey]]}/>
		{/if}
		</CardFooter>
		{#if depth < 5 && related}
			{#each Object.entries(related) as [_id, note] (note.id)}
  				<Note parents={[...parents, id]} kind={kind} parent={id} related={note.related} depth={depth+1} pubkey={note.pubkey} created_at={note.created_at} tags={note.tags} id={note.id} content={note.content}/>
			{/each}
		{/if}
	</Card>
</Fade>
