import { writable } from 'svelte-local-storage-store';

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const preferences = writable('preferences', {
	theme_name: 'light',
	public_key: '',
	private_key: '',
	relay: 'wss://nostr.onsats.org'
});
