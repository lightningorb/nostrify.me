<script lang="ts">
	import { print } from '$lib/utils.ts';
	import { preferences } from '$lib/store.ts';
	import Key from '$lib/key.ts';
	import {
		Container,
		Row,
		Col,
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardSubtitle,
		CardText,
		CardTitle
	} from 'sveltestrap';
	import { get } from 'svelte/store';
	import { Button, Form, FormGroup, FormText, Label, Input } from 'sveltestrap';
	import Relay from '$lib/components/Relay.svelte';
	import ThemeSelector from '$lib/components/ThemeSelector.svelte';
	import ImageFilter from '$lib/components/settings/ImageFilter.svelte';
	let prefs = {};
	preferences.subscribe((x) => (prefs = x));
	let global_hours = prefs.global_hours;
	const clear_notes = () => preferences.update(({ notes, ...rest }) => ({ notes: {}, ...rest }));
	const clear_prefs = () => delete localStorage.preferences;
	const add_relay = () =>
		preferences.update(({ relays, ...rest }) => {
			relays.push('');
			return { relays, ...rest };
		});
	let public_key = '';
	let private_key = '';
	preferences.subscribe((x) => {
		public_key = new Key(x.public_key).as_npub();
		private_key = new Key(x.private_key).as_nsec();
	});
</script>

<h1>Profile</h1>
<br />

<Container>
	<Row>
		<Col>
			<Card class="mb-3">
				<CardHeader>
					<CardTitle>General</CardTitle>
				</CardHeader>
				<CardBody>
					<ThemeSelector />
					<Label for="global_hours">Hours of global to get</Label>
					<Input
						type="text"
						id="global_hours"
						placeholder="1"
						on:change={() => {
							let p = get(preferences);
							p.global_hours = global_hours;
							preferences.set(p);
						}}
						bind:value={global_hours}
					/>
				</CardBody>
			</Card>

			<Card class="mb-3">
				<CardHeader>
					<CardTitle>Keys</CardTitle>
				</CardHeader>
				<CardBody>
					<Label for="public_key">Public Key</Label>
					<Input
						type="text"
						name="pubic key"
						id="public_key"
						placeholder={'npub...'}
						on:change={(x) => {
							let p = get(preferences);
							let key = new Key(x.target.value);
							p.public_key = key.as_hex();
							preferences.set(p);
						}}
						value={public_key}
					/>

					<Label for="private_key">Private Key</Label>
					<Input
						type="text"
						name="pviate key"
						id="private_key"
						placeholder={'nsec...'}
						on:change={(x) => {
							let p = get(preferences);
							let key = new Key(x.target.value);
							p.private_key = key.as_hex();
							preferences.set(p);
						}}
						value={private_key}
					/>
				</CardBody>
			</Card>

			<!-- <ImageFilter /> -->

			<Card class="mb-3">
				<CardHeader>
					<CardTitle>Image Filters</CardTitle>
				</CardHeader>
				<CardBody>
					<td
						><Input
							type="switch"
							label="show images"
							checked={prefs.show_images}
							on:change={(x) => {
								let p = get(preferences);
								p.show_images = !p.show_images;
								preferences.set(p);
							}}
						/></td
					>
					<br />
					<td
						><Input
							type="switch"
							label="show profile images"
							checked={prefs.show_profile_images}
							on:change={(x) => {
								let p = get(preferences);
								p.show_profile_images = !p.show_profile_images;
								preferences.set(p);
							}}
						/></td
					>
					<hr />
					<td
						><Input
							type="switch"
							label="show images on global"
							checked={prefs.show_global_images}
							on:change={(x) => {
								let p = get(preferences);
								p.show_global_images = !p.show_global_images;
								preferences.set(p);
							}}
						/></td
					>
					<br />
					<td
						><Input
							type="switch"
							label="show profile images on global"
							checked={prefs.show_global_profile_images}
							on:change={(x) => {
								let p = get(preferences);
								p.show_global_profile_images = !p.show_global_profile_images;
								preferences.set(p);
							}}
						/></td
					>
				</CardBody>
			</Card>

			<Card class="mb-3">
				<CardHeader>
					<CardTitle>Relays</CardTitle>
				</CardHeader>
				<CardBody>
					<Button on:click={add_relay}>Add Relay</Button>
					<br />
					<br />
					<FormGroup>
						{#each prefs.relays as relay, i}
							<Relay {relay} {i} />
						{/each}
					</FormGroup>
				</CardBody>
			</Card>

			<Card class="mb-3">
				<CardHeader>
					<CardTitle>Danger Zone</CardTitle>
				</CardHeader>
				<CardBody>
					<p>If things seem broken, try this:</p>
					<Button on:click={clear_prefs}>Clear all prefs</Button>
				</CardBody>
			</Card>
		</Col>
	</Row>
</Container>
