import pool from '$lib/pool.ts';
import db from '$lib/db.ts';

class Subscriptions {
	timer: number = 0;
	sub_pubkeys: Set<string> = new Set([]);

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
					db.insert_identity_data(ev);
				});
			}
			return;
		}, 2000);
		return;
	}
}

const subs = new Subscriptions();
export default subs;
