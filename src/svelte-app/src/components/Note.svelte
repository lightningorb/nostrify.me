<script lang="coffeescript">
	import Fa from 'svelte-fa/src/fa.svelte'
	import db from '$lib/db.coffee'
	import Post from '../components/Post.svelte'
	import Note from '../components/Note.svelte'
	import { faReply } from '@fortawesome/free-solid-svg-icons/index.js'
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
	export event = null
	export d = 0
	e = event
	tags = JSON.parse(e.tags)
	makeSafeHtml = (content) ->
	    imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi
	    content = content.replace(imgRegex, '<img src="$1" alt="image">')
	    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
	    content
	source = makeSafeHtml(e.content)
	source = source.replace(/<img/gi, '<img class="img-fluid"')
	ref = tags.filter((x) => x[0] == 'e')
	onMount(() ->
	    isOpen = true
	)
	is_replying = false
	events = db.get_related(e.id)
</script>
{#if e}
	<Fade {isOpen} id={e.id}>
		<Card class="mb-3" style={"padding-left: "+ d*5+"px; margin-left: "+d*5+'px;'}>
			<CardHeader>
				<Time id={'time' + e.id} relative live={1000} timestamp={e.created_at * 1000} />
				{#if ref.length != 0}
					<small>In reply to: <a href={'/e/?id=' + ref[0][1]}>{ref[0][1].slice(0, 5)}</a>...</small>
				{/if}
			</CardHeader>
			<CardBody>
				<CardText>
					<SvelteMarkdown {source} />
				</CardText>
			</CardBody>
			<CardFooter>
				<small>User Identity: {e.pubkey.slice(0, 10)}...</small>
				<br />
				<small>Note Identity: {e.id.slice(0, 10)}...</small>
				<!-- <small>Note Identity: <a href={'/e/?id=' + e.id}>{e.id.slice(0, 10)}</a>...</small> -->
				<Button size='sm' on:click={() => is_replying = true}><Fa style="font-size: 0.8em;" icon={faReply}/></Button>
			{#if is_replying}
				<Post e={e.id}/>
			{/if}
			</CardFooter>
			{#if d < 2}
				{#each events as sub}
					<Note event={sub} d={d+1}/>
				{/each}
			{/if}
		</Card>
	</Fade>
{/if}