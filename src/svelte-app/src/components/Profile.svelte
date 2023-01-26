<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import {
		Icon,
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
	import { preferences } from '$lib/store.ts';
	import { Profile } from '$lib/interfaces.ts';
	import { onDestroy, onMount } from 'svelte';
	import { calculateId, signId } from 'nostr';
	import Avatar from './Avatar.svelte';
	import db from '$lib/db.ts';
	import pool from '$lib/pool.ts';

	export let key;
	export let debug = false;

	let profile: Profile = {
		name: '',
		website: '',
		npub: '',
		picture: '',
		about: '',
		nip05: '',
		nip05valid: false
	};

	let edit: boolean = false;
	let prefs: any = null;
	preferences.subscribe((x) => (prefs = x));
	let subs: any[] = [];
	$: me = key == prefs.public_key;

	if (key) {
		const event_cb = (ev: any) => {
			db.insert_data(ev);
			profile = JSON.parse(ev.content);
		};

		onMount(() => {
			var db_profile = db.get_identity(key);
			if (db_profile) db_profile = JSON.parse(db_profile.content);
			subs = pool.sub('profile', {
				kinds: [0],
				authors: [key]
			});

			for (let s of subs) {
				s[1].on('event', event_cb);
			}
		});

		onDestroy(() => {
			for (let s of subs) {
				s[1].unsub();
			}
		});
	}

	var publish_profile = async function (event) {
		console.log(event);
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
	};

	var set_metadata = async function () {
		edit = false;
		var event = {
			kind: 0,
			pubkey: prefs.public_key,
			created_at: Math.floor(Date.now() / 1000),
			tags: [],
			content: JSON.stringify(profile)
		};
		event.id = await calculateId(event);
		event.sig = await signId(prefs.private_key, event.id);
		publish_profile(event);
	};
</script>

{#if debug}
	<p>key: {key}</p>
	<p>me: {me}</p>
{/if}

<h1>Profile</h1>
<br />
{#if profile}
	<Card class="mb-3" style="max-width: 600px; margin-bottom: 0px; padding-bottom: 0px;">
		<CardHeader>
			{#if edit}
				<Label for="name">name</Label>
				<Input type="textarea" name="name" id="name" bind:value={profile.name} />
			{:else if profile.name}
				<CardTitle>{profile.name}</CardTitle>
			{:else if me}
				<p><small>Please set your profile name or pseudonym.</small></p>
			{/if}
		</CardHeader>
		<CardBody>
			{#if profile.picture}
				<Avatar src={profile.picture} alt={profile.name} width={300} height={300} />
			{:else if me}
				<p><small>Please set your profile picture URL</small></p>
			{/if}
			{#if edit}
				<Label for="picture_url">Picture URl</Label>
				<Input type="text" name="picture_url" id="picture_url" bind:value={profile.picture} />
			{/if}
		</CardBody>
		<CardFooter>
			{#if edit}
				<Label for="about">About</Label>
				<Input type="textarea" name="about" id="about" bind:value={profile.about} />
			{:else if profile.about}
				<p>About: <SvelteMarkdown source={profile.about} /></p>
			{:else if me}
				<p><small>Please tell us what this profile is about.</small></p>
			{/if}
			{#if edit}
				<Label for="nip05">Nip05</Label>
				<Input type="text" name="nip05" id="nip05" bind:value={profile.nip05} />
			{:else if profile.nip05}
				<p>Nip05: {profile.nip05}</p>
			{:else if me}
				<p><small>Please tell us your NIP05 identifier.</small></p>
			{/if}
			{#if edit}
				<Label for="website">Website</Label>
				<Input type="text" name="website" id="website" bind:value={profile.website} />
			{:else if profile.website}
				<p>Website: {profile.website}</p>
			{:else if me}
				<p>
					<small
						>Please set your website. If you're not sure, you can use https://nostrify.me.</small
					>
				</p>
			{/if}
		</CardFooter>
		<hr style="padding-bottom: 0xp; margin-bottom: 0px; border-width: 2px !important;" />
	</Card>
	{#if edit}
		<Button on:click|once={set_metadata}>Submit</Button>
	{:else if me}
		<Button on:click={() => (edit = true)}><Icon name="pen-fill" /></Button>
	{/if}
{/if}
