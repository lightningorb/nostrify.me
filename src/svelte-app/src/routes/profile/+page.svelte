<script lang="coffee">
  import SvelteMarkdown from 'svelte-markdown'
  import { calculateId, signId } from 'nostr'
  import { Icon } from 'sveltestrap';
  import {
    Button,
    Card,
    Label,
    CardBody,
    CardFooter,
    CardHeader,
    CardSubtitle,
    Input,
    CardText,
    CardTitle
  } from 'sveltestrap';
  import { Figure, Image } from 'sveltestrap';
  import db from '$lib/db.coffee'
  import { print } from '$lib/utils.ts';
  import { preferences } from '$lib/store.js'
  import { onMount } from 'svelte'
  import { onDestroy } from 'svelte'
  import pool from '$lib/pool.ts'
  profile =
    name: null
    website: null
    npub: null
    picture: null
    about: null
  [edit, prefs] = [false, null]
  preferences.subscribe (x) -> prefs = x
  if prefs.public_key?
    event_cb = (relay, sub_id, ev) =>
      if sub_id is 'profile'
        db.insert_data(ev)
        profile = JSON.parse(ev.content)
    onMount ->
      pool.pool.subscribe 'profile',
        kinds: [0],
        authors: [prefs.public_key]
      pool.add_event_callback event_cb
    onDestroy ->
      pool.remove_event_callback event_cb
      pool.pool.unsubscribe 'profile'
</script>

<h1>Profile</h1>
<br />
{#if profile}
	<Card class="mb-3" style="max-width: 600px;">
		<CardHeader>
			{#if edit}
				<Label for="name">name</Label>
				<Input type="textarea" name="name" id="name" bind:value={profile.name} />
			{:else if profile.name}
				<CardTitle>{profile.name}</CardTitle>
      {:else}
        <p><small>Please set your profile name or pseudonym.</small></p>
			{/if}
		</CardHeader>
		<CardBody>
			{#if profile.picture}
				<Figure caption={profile.npub}>
					<Image
						style="max-height: 300px; max-width: 300px;"
						fluid
						alt="Landscape"
						src={profile.picture}
					/>
				</Figure>
			{:else}
				<p><small>Please set your profile picture URL</small></p>
			{/if}
			{#if edit}
				<Label for="picture_url">Picture URl</Label>
				<Input type="text" name="picture_url" id="picture_url" bind:value={profile.picture} />
			{/if}
		</CardBody>
		{#if edit}
			<Label for="about">About</Label>
			<Input type="textarea" name="about" id="about" bind:value={profile.about} />
		{:else if profile.about}
			<CardFooter>About: <SvelteMarkdown source={profile.about} /></CardFooter>
    {:else}
      <p><small>Please tell us what this profile is about.</small></p>
		{/if}
		{#if edit}
			<Label for="website">Website</Label>
			<Input type="text" name="website" id="website" bind:value={profile.website} />
		{:else if profile.website}
			<CardFooter>Website: {profile.website}</CardFooter>
      {:else}
      <p><small>Please set your website. If you're not sure, you can use https://nostrify.me.</small></p>
		{/if}
	</Card>
	{#if edit}
		<Button
			on:click|once={async () => {
				edit = false;
				event = {
					kind: 0,
					pubkey: prefs.public_key,
					created_at: Math.floor(Date.now() / 1000),
					tags: [],
					content: JSON.stringify(profile)
				};
				event.id = await calculateId(event);
				event.sig = await signId(prefs.private_key, event.id);
				for (var i in prefs.relays) {
					const relay = window.NostrTools.relayInit(prefs.relays[i]);
					await relay.connect(1);
					relay.on('connect', async () => {
						let pub = await relay.publish(event);
						pub.on('ok', () => {
							console.log(`ok`);
						});
						pub.on('seen', () => {
							console.log(`we saw the event`);
						});
						pub.on('failed', (reason) => {
							console.log(`failed to publish`);
							console.log(reason);
						});
					});
				}
				// var res = await pool.pool.send(event)
			}}>Submit</Button
		>
	{:else}
		<Button on:click={() => (edit = true)}><Icon name="pen-fill" /></Button>
	{/if}
{/if}
