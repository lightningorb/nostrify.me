/*
 * @Author: lnorb.com
 * @Date:   2023-01-26 15:39:16
 * @Last Modified by:   lnorb.com
 * @Last Modified time: 2023-01-28 06:21:59
 */

import axios from 'axios';

async function verify_nip05(profile: object, pubkey: string): Promise<void> {
	if (profile.nip05 != undefined) {
		var nip05_local: string = profile.nip05.split('@')[0];
		var nip05_domain: string = profile.nip05.split('@')[1];
		if (!(nip05_domain && nip05_local)) return false;
		try {
			var response = await axios({
				method: 'get',
				url: `https://${nip05_domain}/.well-known/nostr.json?name=${nip05_local}`
			});
			if (response.data && response.data.names) {
				return response.data.names[nip05_local] == pubkey;
			}
		} catch {
			return false;
		}
	}
}

export { verify_nip05 };
