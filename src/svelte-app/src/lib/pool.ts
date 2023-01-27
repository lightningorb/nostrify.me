/*
 * @Author: lnorb.com
 * @Date:   2023-01-27 03:59:54
 * @Last Modified by:   lnorb.com
 * @Last Modified time: 2023-01-27 04:43:24
 */
/*
 * @Author: lnorb.com
 * @Date:   2023-01-25 11:47:01
 * @Last Modified by:   lnorb.com
 * @Last Modified time: 2023-01-27 03:59:04
 */

import { preferences } from '$lib/store.ts';
import { get } from 'svelte/store';
import { browser, dev } from '$app/environment';
// import { relayInit, generatePrivateKey, getPublicKey, getEventHash, signEvent } from 'nostr-tools';

class Pool {
	constructor() {
		this.relays = new Set();
		this.subs = {};
	}
	init() {
		const prefs = get(preferences);
		if (browser) prefs.relays.forEach((x) => this.relays.add(window.NostrTools.relayInit(x)));
		if (browser && prefs.public_key === '') {
			prefs.private_key = window.NostrTools.generatePrivateKey();
			prefs.public_key = window.NostrTools.getPublicKey(prefs.private_key);
			preferences.set(prefs);
		}
	}
	connect() {
		this.relays.forEach(async (x) => {
			try {
				await x.connect();
			} catch {
				console.log('could not connect to', x.url);
			}
		});
	}
	on(event_name, callback) {
		if (event_name == 'event') {
			Object.entries(this.subs).forEach((sub) => {
				sub[1].forEach((s) => s[1].on('event', (event) => callback(s[0], sub[0], event)));
			});
		} else {
			this.relays.forEach((relay) => relay.on(event_name, () => callback(relay)));
		}
	}
	unsub(x, y) {}
	sub(name, what) {
		var subs = [];
		for (var relay of this.relays.values()) {
			if (this.subs[name] == undefined) {
				this.subs[name] = [];
			}
			var s = [relay.url, relay.sub([what])];
			this.subs[name].push(s);
			subs.push(s);
		}
		return subs;
	}
}

const pool = new Pool();
export default pool;
