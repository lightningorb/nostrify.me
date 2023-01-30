<script>
	import { Lottie } from 'lottie-svelte';
	import { TabContent, TabPane } from 'sveltestrap';
	import axios from 'axios';
	import SvelteMarkdown from 'svelte-markdown';
	import { goto } from '$app/navigation';
	import Keys from '$lib/components/Keys.svelte';
	import Login from '$lib/components/Login.svelte';
	import Nav from '$lib/components/NostrificationNav.svelte';
	import { preferences } from '$lib/store.ts';
	import { Col, Container, Row } from 'sveltestrap';
	import { page } from '$app/stores';
	import Profile from '$lib/components/Profile.svelte';
	import { onMount } from 'svelte';
	import {
		Card,
		CardBody,
		CardFooter,
		Input,
		CardHeader,
		CardSubtitle,
		CardText,
		Button,
		CardTitle
	} from 'sveltestrap';
	let prefs = {};
	preferences.subscribe((x) => (prefs = x));
	function scrollIntoView({ target }) {}
	$: otp = '';
	$: step = 0;
	$: step_0_active = step == 0;
	$: step_1_active = step == 1;
	$: step_2_active = step == 2;
	$: step_3_active = step == 3;
	let i_have_keys = prefs.public_key;
	let generate_some = false;

	function typewriter(node, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t) => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>

<Nav />

<span class="landing-header">
	<Container class="landing-header mt-2">
		<Row>
			<Col md="8" class="text-center offset-md-2" />
		</Row>
	</Container>
</span>

<TabContent>
	<TabPane tabId="step1" tab="Steps:" active={step_0_active}>
		<span class="landing-header">
			<Container class="landing-header mt-2">
				<Row>
					<Col md="8" class="text-center offset-md-2">
						<br />
						<br />
						<span style="slogan landing-header">
							<Card class="shadow-sm mb-0">
								<CardBody>
									<h3 transition:typewriter>nos·tri·fy miː</h3>

									<br />
									<CardText>
										<small />
										<p><i>"To adopt, accept, or include as part of one's own culture."</i></p>

										<div style="max-width:200px; margin: auto;">
											<Lottie
												path="https://assets1.lottiefiles.com/packages/lf20_31wO02KXPj.json"
												speed={1}
											/>
										</div>
									</CardText>
								</CardBody>
							</Card>
							<hr class="mt-0" />
							<!-- 							<video width="320" height="640" autoplay controls>
							  <source src="https://nostrify.me/nostr.mp4" type="video/mp4">
							Your browser does not support the video tag.
							</video> -->
						</span>
					</Col>
				</Row>
			</Container>
		</span>
	</TabPane>
	<TabPane tabId="keys" tab="..1" active={step_1_active}>
		<span class="landing-header">
			<Container class="landing-header mt-2">
				<Row>
					<Col md="8" class="text-center offset-md-2">
						<h2>Step 1: Keys</h2>
						<br />
						{#if !i_have_keys}
							<SvelteMarkdown source={`If you don't know what keys are, click "generate some"`} />
							<br />
							<Button class="shadow" color={'light'} disabled={i_have_keys || generate_some}>
								<a
									href="#step2"
									on:click={() => {
										generate_some = false;
										i_have_keys = true;
									}}>I have keys</a
								>
							</Button>
							<Button class="shadow" color={'light'} disabled={i_have_keys || generate_some}>
								<a
									href="#step2"
									on:click={() => {
										generate_some = true;
										i_have_keys = true;
										prefs.private_key = window.NostrTools.generatePrivateKey();
										prefs.public_key = window.NostrTools.getPublicKey(prefs.private_key);
										preferences.set(prefs);
									}}>Generate some</a
								>
							</Button>
						{/if}
						{#if i_have_keys}
							<Keys />
							<hr
								class="mt-0"
								style="background-color: black !important; color: black !important;"
							/>
						{:else if generate_some}
							<SvelteMarkdown source={`Save these carefully in a text file on your computer.`} />
							<Keys />
							<hr
								class="mt-0"
								style="background-color: black !important; color: black !important;"
							/>
						{/if}
					</Col>
				</Row>
			</Container>
		</span>
	</TabPane>
	<TabPane tabId="step2" tab="..2.." bind:active={step_2_active}>
		<span class="landing-header">
			<Container class="landing-header mt-2">
				<Row>
					<Col md="8" class="text-center offset-md-2">
						<h2>Step 2: Profile</h2>
						<span id="step2" />
						{#if prefs.private_key}
							<br />
							<p>Fill out these fields with your information, if you haven't already.</p>
							<p>
								By clicking submit, you undertand you are publishing it to the Nostr network of
								relays.
							</p>
							<p>(If you are not sure what this means, use a pseudonym, not your real name).</p>
						{/if}
						<Profile key={prefs.public_key} />
					</Col>
				</Row>
			</Container>
		</span>
	</TabPane>
	<TabPane tabId="step3" tab="and 3!" bind:active={step_3_active}>
		<span class="landing-header">
			<Container class="landing-header mt-2">
				<Row>
					<Col md="8" class="text-center offset-md-2">
						<p>
							Please note: Nostrification is currently only open to trusted family friends and
							colleagues.
						</p>
						<Input
							type="text"
							placeholder="OTP"
							style="max-width: 300px; margin: auto;"
							bind:value={otp}
						/>
						<br />
						<p>Read our FAQ to find out more.</p>
						<hr />
						<h3>Nostrification checklist:</h3>
						<div style="max-width: 300px; margin: auto;">
							<p>Keys ✓</p>
							<p>Nip 05 ✓</p>
							<p>OTP ✓</p>
						</div>
						<Button
							class="shadow"
							color={'light'}
							on:click={() => {
								const headers = {
									'Content-Type': 'application/json'
								};
								let profile = window.db.get_profile(prefs.public_key);
								let doc = {
									name: profile.name,
									pubkey: profile.pubkey,
									otp: otp
								};
								console.log(doc);
								let body = JSON.stringify(doc);
								axios
									.post('https://lnorb.com/api/nip05/register/', body, { headers: headers })
									.then(function (response) {
										console.log(response);
										confirm('Looking good');
									})
									.catch(function (error) {
										console.log(error);
										if (error.response != undefined) {
											confirm(error.response.data.detail);
										} else {
											confirm('Error');
										}
									});
							}}>Nostrify me</Button
						>
					</Col>
				</Row>
			</Container>
		</span>
	</TabPane>
</TabContent>

<style>
	:global(.landing-header) {
		width: 900px;
		margin-left: auto;
		margin-right: auto;
		display: block;
	}
	:global(.landing-header-bg) {
		background: #1074b4;
		color: white;
	}
	:global(.slogan) {
		max-width: 300px;
	}
</style>
