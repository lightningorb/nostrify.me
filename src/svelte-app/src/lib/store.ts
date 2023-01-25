import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export var input_focus = writable(false);
export var key_pressed = writable([{}]);

var initial = {
	stack: false,
	theme_name: 'light',
	global_hours: 1,
	public_key: '',
	private_key: '',
	debug: false,
	show_images: true,
	show_profile_images: true,
	relays: [
		'wss://nostr.lnorb.com',
		'wss://relay.damus.io',
		'wss://nostr-pub.wellorder.net',
		'wss://nostr.xpersona.net',
		'wss://nostr-relay.freedomnode.com',
		'wss://relay.nostrmoto.xyz',
		'wss://nostrrelay.com',
		'wss://nostr1.tunnelsats.com',
		'wss://nostr.rewardsbunny.com',
		'wss://nostr.lnprivate.network',
		'wss://node01.nostress.cc',
		'wss://nostr.mouton.dev'
	]
};

export const preferences = persisted('preferences', initial);

preferences.subscribe((value) => {
	if (typeof value.theme_name !== 'string') {
		alert('theme_name is not a string. You may need to clear your cookies.');
	}
	if (typeof value.global_hours !== 'number') {
		alert('global_hours is not a number. You may need to clear your cookies.');
	}
	if (typeof value.public_key !== 'string') {
		alert('public_key is not a string. You may need to clear your cookies.');
	}
	if (typeof value.private_key !== 'string') {
		alert('private_key is not a string. You may need to clear your cookies.');
	}
	if (!Array.isArray(value.relays)) {
		alert('relays is not an array. You may need to clear your cookies.');
	}
	if (value.show_images === undefined) {
		value.show_images = true;
		preferences.set(value);
	}
	if (value.show_profile_images === undefined) {
		value.show_profile_images = true;
		preferences.set(value);
	}
});
