/*
 * @Author: lnorb.com
 * @Date:   2023-01-28 09:45:19
 * @Last Modified by:   lnorb.com
 * @Last Modified time: 2023-01-28 09:45:24
 */

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
	show_unverified_accounts: true,
	show_global_images: false,
	show_global_profile_images: false,
	relays: [
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

export const preferences = persisted('prefs_v10', initial);
