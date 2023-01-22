import { preferences } from '$lib/store.js';
import { get } from 'svelte/store';
import { browser, dev } from '$app/environment';
import { RelayPool } from 'nostr';

interface Callback {
	(relay: any): void;
}

interface EventCallback {
	(relay: any, sub_id: string, ev: any): void;
}

class Pool {
	callbacks: Callback[];
	event_callbacks: Set<EventCallback>;
	pool: any;

	constructor() {
		this.callbacks = [];
		this.event_callbacks = new Set([]);
	}

	init() {
		const prefs = get(preferences);
		if (browser && prefs.public_key === '') {
			prefs.private_key = window.NostrTools.generatePrivateKey();
			prefs.public_key = window.NostrTools.getPublicKey(prefs.private_key);
			preferences.set(prefs);
		}
		this.pool = RelayPool(prefs.relays);
		this.pool.on('open', (relay) => {
			this.callbacks.forEach((cb) => cb(relay));
		});
		this.pool.on('event', (relay, sub_id, ev) => {
			this.event_callbacks.forEach((cb) => cb(relay, sub_id, ev));
		});
		return this.pool;
	}

	add_callback(cb: (relay: any) => void) {
		this.callbacks.push(cb);
	}

	clear_callbacks() {
		this.callbacks = [];
	}

	add_event_callback(cb: (relay: any, sub_id: string, ev: any) => void) {
		this.event_callbacks.add(cb);
	}

	remove_event_callback(cb: (relay: any, sub_id: string, ev: any) => void) {
		this.event_callbacks.add(cb);
	}
}

const pool = new Pool();
export default pool;
