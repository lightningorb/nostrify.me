import { writable } from 'svelte-local-storage-store';

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const preferences = writable('preferences', {
	theme_name: 'light',
	public_key: '',
	private_key: '',
	relay: 'wss://nostr.onsats.org',
	relays: [
		'wss://nostream-production-539a.up.railway.app',
		'wss://relay.damus.io',
		'wss://nostr-pub.wellorder.net',
		'wss://nostr.xpersona.net',
		'wss://nostr-relay.freedomnode.com',
		'wss://relay.nostrmoto.xyz',
		'wss://nostrrelay.com',
		'wss://nostr1.tunnelsats.com',
		'wss://nostr.rewardsbunny.com',
		'wss://nostr.lnprivate.network',
		'wss://node01.nostress.cc'
	]
});
