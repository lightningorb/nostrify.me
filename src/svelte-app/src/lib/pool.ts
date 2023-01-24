import { preferences } from '$lib/store.ts';
import { get } from 'svelte/store';
import { browser, dev } from '$app/environment';
import { relayInit, generatePrivateKey, getPublicKey, getEventHash, signEvent } from 'nostr-tools';

class Pool {
	constructor() {
		this.relays = new Set();
		this.subs = {};
	}
	init() {
		const prefs = get(preferences);
		prefs.relays.forEach((x) => this.relays.add(relayInit(x)));
		if (browser && prefs.public_key === '') {
			prefs.private_key = generatePrivateKey();
			prefs.public_key = getPublicKey(prefs.private_key);
			preferences.set(prefs);
		}
	}
	connect() {
		this.relays.forEach(async (x) => {
			await x.connect();
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
