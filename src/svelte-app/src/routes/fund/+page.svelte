<script lang="ts">
	import Nav from '$lib/components/NostrificationNav.svelte';
	import SvelteMarkdown from 'svelte-markdown';
</script>

<Nav />

<br />

<h1>Nostr + Lightning Development Fund</h1>

<SvelteMarkdown
	source={`

Nostrify.me would like to announce a developer and network fund. We will soon embark on fund raising activities, and userbase growth activities for both Nostr and Lightning. The funds will be directly allocated to:

- Supporting projects.
- Supporting the Nostr infrastructure.

The funds will hopefully come from providing services, such as NIP05.

Please remember the 'raison d'etre' of Nostr is to shift the power of big tech into the hands of its users.

We will be fully transparent with regards to:

- How we are raising funds.
- How we are allocating funds.

We expect extreme scrutiny, and will be fully transparent with regards to the process.

More to come.

`}
/>

<style type="text/css">
	:global(p) {
		margin-top: 30px;
		margin-bottom: 20px;
	}
</style>
