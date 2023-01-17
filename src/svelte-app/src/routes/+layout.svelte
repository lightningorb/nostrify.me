<script>
	import { faHandshake } from '@fortawesome/free-solid-svg-icons/index.js';

	import Fa from 'svelte-fa/src/fa.svelte';
	import { faRightToBracket, faRightFromBracket, faDove } from '@fortawesome/free-solid-svg-icons/index.js';
	/** @type {import('./$types').LayoutData} */
	export let data;
	import { base } from '$app/paths';
	import { preferences } from '$lib/store.js';
	import { Styles } from 'sveltestrap';
	// import Nav from '../components/Nav.svelte';
	// import Banner from '../components/Banner.svelte';
	// import Footer from '../components/Footer.svelte';
	// import { preferences } from '$lib/store.js';
	// import { base } from '$app/paths';
	// import { browser, dev } from '$app/environment';
	// import { save_user_info } from '$lib/utils.js';
	import { Col, Container, Row } from 'sveltestrap';
	// import { get } from 'svelte/store';
	// import '$lib/interceptors.js';
	// let p = get(preferences);
	// p.podcast = '';
	// preferences.set(p);
	// let theme_name = p.theme_name || 'light';
</script>

<svelte:head>
	<!-- <link rel="stylesheet" href="{base}/style-{theme_name}.css" /> -->
</svelte:head>
<Styles />
<!-- <Banner /> -->
<!-- <Nav /> -->
<!-- <Container>
    <Row cols={1}>
        <Col><slot /></Col>
    </Row>
</Container> -->
<!-- <Nav /> -->


<Container>
	<Row cols={2}>
		<Col xs={2}>
			<div class="submenu">
				<br />
				<Fa style="font-size: 2em; color: #1DA1F2;" icon={faDove} />
				<br />
				<br />
				{#each data.sections as section}
					<a href={`${base}/${section.slug}`}>
						{#if section.icon}
							<Fa icon={section.icon} />
						{/if}
						{@html section.title}
					</a>
					<br />
					<br />
				{/each}
				<hr />
			</div>
		</Col>
		<Col xs={10}>
			<slot />
		</Col>
	</Row>
</Container>
<br />

<!-- <Footer /> -->
<style>
	a {
		color: black;
		font-size: 1.2em;
		text-decoration: none;
	}
</style>
