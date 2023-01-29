/*
 * @Author: lnorb.com
 * @Date:   2023-01-28 12:00:08
 * @Last Modified by:   lnorb.com
 * @Last Modified time: 2023-01-28 12:06:07
 */

import { verify_nip05 } from '$lib/nostr-utils.js';
import { Profile } from '$lib/interfaces.ts';
import pool from '$lib/pool.ts';

import { Mutex, Semaphore, withTimeout } from 'async-mutex';
const mutex = new Mutex();

class Subscriptions {
	checking_nips: boolean = false;

	async main(pubkey: string): void {
		await mutex.runExclusive(async () => {
			var profile = window.db.get_profile(pubkey);
			if (profile == undefined) {
				window.db.insert_blank_profile(pubkey);
				profile = window.db.get_profile(pubkey);
			}
			if (profile.profile_check_requested || profile.checking_profile || profile.profile_checked) {
				return;
			}
			profile.profile_check_requested = true;
			window.db.update_profile(profile, pubkey);
		});
	}

	sub_to_profiles() {
		var sub_profiles = window.db.get_profiles_that_need_checking();
		var subs = pool.sub('event_ids', {
			kinds: [0],
			authors: sub_profiles.map((x) => x.pubkey)
		});
		for (var profile of sub_profiles) {
			profile.checking_profile = true;
			window.db.update_profile(profile, profile.pubkey);
		}
		for (var s of subs) {
			s[1].on('event', async (ev) => {
				await mutex.runExclusive(async () => {
					var profile = JSON.parse(ev.content);
					var db_profile = window.db.get_profile(ev.pubkey);
					if (db_profile.profile_checked == true) return;
					profile.profile_checked = true;
					profile.checking_profile = false;
					window.db.update_profile(profile, ev.pubkey, s[0]);
				});
			});
			s[1].on('eose', () => {
				s[1].unsub();
			});
		}
		return;
	}

	nip05_timer() {
		setInterval(() => {
			this.sub_to_profiles();
		}, 1000);

		setInterval(async () => {
			let needs_nip05_check = window.db.get_profiles_that_need_nip05_check();
			if (needs_nip05_check.length > 0 && !this.checking_nips) {
				this.checking_nips = true;
				for (var profile of needs_nip05_check) {
					profile.nip05valid = await verify_nip05(profile, profile.pubkey);
					profile.nip05checked = true;
					window.db.update_profile(profile, profile.pubkey);
				}
				this.checking_nips = false;
			}
		}, 1000);
	}
}

const subs = new Subscriptions();
export default subs;
