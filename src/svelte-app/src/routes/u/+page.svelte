<script lang="ts">
	import { preferences } from '$lib/store.ts';
	import { page } from '$app/stores';
	import UserNotes from '$lib/components/UserNotes.svelte';
	import Profile from '$lib/components/Profile.svelte';
	let prefs = {};
	preferences.subscribe((x) => (prefs = x));
	let key = $page.url.searchParams.get('key') || prefs.public_key;
</script>

<Profile {key} />
<UserNotes {key} />
