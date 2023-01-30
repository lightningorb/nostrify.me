<script lang="ts">
	import Clean from '$lib/components/Clean.svelte';
	import subs from '$lib/subscriptions.ts';
	import PlainText from '$lib/components/PlainText.svelte';
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
		Container,
		Col,
		Row,
		Input,
		CardText,
		CardTitle
	} from 'sveltestrap';
	import { preferences } from '$lib/store.ts';
	import { Profile } from '$lib/interfaces.ts';
	import { onDestroy, onMount } from 'svelte';
	import { calculateId, signId } from 'nostr';
	import Avatar from './Avatar.svelte';
	import pool from '$lib/pool.ts';

	export let key;
	export let debug = false;

	$: profile = {
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
	$: me = key == prefs.public_key;
	let interval = 0;

	onMount(async () => {
		console.log('profile on mount');
		console.log(key);
		await subs.main(key);
		let cmd = () => {
			if (key && !edit) {
				var db_profile = window.db.get_profile(key);
				if (db_profile) profile = db_profile;
			}
		};
		interval = setInterval(cmd, 1000);
		cmd();
	});

	onDestroy(() => {
		console.log('profile on destroy');
		clearInterval(interval);
	});

	var publish_profile = async function (event) {
		console.log(event);
		for (var i in prefs.relays) {
			const relay = window.NostrTools.relayInit(prefs.relays[i]);
			try {
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
			} catch {
				console.log('failed to publish');
			}
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
<br />
{#if profile}
	<Card class="profile-card" md={5}>
		<CardHeader>
			{#if edit}
				<Label for="name">name / pseudonym</Label>
				<Input
					type="textarea"
					name="name"
					id="name"
					bind:value={profile.name}
					invalid={profile.name == ''}
					valid={profile.name != ''}
					feedback={profile.name ? 'great' : 'required'}
					on:change={(x) => {
						var name = x.target.value;
						profile.nip05 = x.target.value.replace(/[^a-z0-9-_\.]/gi, '') + '@nostrify.me';
					}}
				/>
			{:else if profile.name}
				<CardTitle>{profile.name}</CardTitle>
			{:else if me}
				<p><small>Please set your profile name or pseudonym.</small></p>
			{/if}
		</CardHeader>
		<CardBody>
			{#if profile.picture}
				<Avatar src={profile.picture} alt={profile.name} size={'300px'} />
				<br />
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
				<!-- <CardSubtitle>About</CardSubtitle> -->
				<CardText><PlainText text={profile.about} /></CardText>
			{:else if me}
				<p><small>Please tell us what this profile is about.</small></p>
			{/if}
			{#if edit}
				<Label for="nip05">Nip05</Label>
				<Input
					type="text"
					name="nip05"
					id="nip05"
					bind:value={profile.nip05}
					invalid={profile.nip05 == ''}
					valid={profile.nip05 != ''}
					feedback={profile.nip05 ? 'great' : 'required'}
				/>
			{:else if profile.nip05}
				<CardSubtitle>Nip05: {profile.nip05}</CardSubtitle>
				<br />
			{:else if me}
				<p><small>Please tell us your NIP05 identifier.</small></p>
			{/if}
			<br />
			<CardSubtitle>Nip05 Valid: {profile.nip05valid ? 'yes' : 'no'}</CardSubtitle>
			<br />
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

			{#if edit}
				<Button style="float: right;" size="sm" color={'light'} on:click={() => (edit = false)}
					>Cancel</Button
				>
				<Button style="float: right;" size="sm" color={'light'} on:click|once={set_metadata}
					>Submit</Button
				>
			{:else if me}
				<Button style="float: right;" size="sm" color={'light'} on:click={() => (edit = true)}
					><Icon name="pen-fill" /></Button
				>
			{/if}
			<br />
		</CardFooter>
		<hr style="padding-bottom: 0xp; margin-bottom: 0px; border-width: 1px !important;" />
	</Card>
	<br />
{/if}

<style>
	:global(.profile-card) {
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
		display: block;
	}
</style>
