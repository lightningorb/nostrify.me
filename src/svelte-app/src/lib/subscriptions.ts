/*
* @Author: lnorb.com
* @Date:   2023-01-26 15:39:16
* @Last Modified by:   lnorb.com
* @Last Modified time: 2023-01-26 18:08:46
*/

import { verify_nip05 } from '$lib/nostr-utils.js';
import pool from '$lib/pool.ts';
import db from '$lib/db.ts';

class Subscriptions {
	timer: number = 0;
	sub_pubkeys: Set<string> = new Set([]);
	needs_nip05_check: Set<string> = new Set([]);
	checking_nips: boolean = false;

	main(pubkey: string): void {
		clearTimeout(this.timer);
		const obj = this;
		if (!db.get_identity(pubkey)) {
			this.sub_pubkeys.add(pubkey);
		}
		this.timer = setTimeout((): void => {
			var subs = pool.sub('event_ids', {
				kinds: [0],
				authors: [...obj.sub_pubkeys]
			});
			for (var s of subs) {
				s[1].on('event', (ev) => {
					var db_ev = db.get_identity(pubkey);
					if (!db_ev) {
						db.insert_identity_data(ev);
						obj.needs_nip05_check.add(ev.pubkey);
					}
				});
			}
			return;
		}, 2000);
		return;
	}

	nip05_timer() {
		setInterval(async () => {
			if (this.needs_nip05_check.size > 0 && !this.checking_nips) {
				this.checking_nips = true;
				var done = new Set([]);
				for (var pubkey of this.needs_nip05_check) {
					var ev = db.get_identity(pubkey);
					var profile = JSON.parse(ev.content);
					profile.nip05valid = await verify_nip05(profile, ev.pubkey);
					ev.content = JSON.stringify(profile);
					db.update_identity_data(ev);
					done.add(pubkey);
				}
				for (var pubkey of done) this.needs_nip05_check.delete(pubkey);
				this.checking_nips = false;
			}
		}, 1000);
	}
}

const subs = new Subscriptions();
export default subs;
