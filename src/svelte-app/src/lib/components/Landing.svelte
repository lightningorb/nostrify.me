<script lang="ts">
	import { Col, Container, Row } from 'sveltestrap';
	import {
		Collapse,
		Navbar,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink,
		Dropdown,
		DropdownToggle,
		DropdownMenu,
		DropdownItem,
		Button
	} from 'sveltestrap';

	let isOpen = false;

	function handleUpdate(event) {
		isOpen = event.detail.isOpen;
	}
</script>

<Navbar color="light" light expand="md">
	<NavbarBrand href="/">nostrify.me</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav class="ms-auto" navbar>
			<NavItem>
				<NavLink href="#components/">Get Nostrified</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="https://github.com/bestguy/sveltestrap">Features</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="https://github.com/bestguy/sveltestrap">Pricing</NavLink>
			</NavItem>
		</Nav>
	</Collapse>
</Navbar>

<span class="landing-header landing-header-bg">
	<Container class="landing-header mt-2">
		<Row>
			<Col md="8" class="text-center offset-md-2">
				<br />
				<br />
				<h2 class="mt-5">
					<b
						>Individuals, freelancers and companies use nostrify.me to verify their Nostr account.</b
					>
				</h2>
				<Button class="mt-4" color={'light'}>Get Nostrified</Button>
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
			</Col>
		</Row>
	</Container>
</span>

<span class="landing-header">
	<Container class="landing-header mt-2">
		<Row>
			<Col md="8" class="text-center offset-md-2">
				<br />
				<br />
				<h2 class="mt-5">
					<b>Create a page to present who you are and what you do in one link.</b>
				</h2>
				<Button class="mt-4" color={'light'}>Get Nostrified</Button>
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
			</Col>
		</Row>
	</Container>
</span>

<style>
	:global(.landing-header) {
		width: 100%;
		margin-left: auto;
		margin-right: auto;
		display: block;
	}
	:global(.landing-header-bg) {
		background: #1074b4;
		color: white;
	}
	:global(.slogan) {
		max-width: 500px;
	}
</style>
