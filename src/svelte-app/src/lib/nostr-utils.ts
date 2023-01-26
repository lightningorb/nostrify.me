import axios from 'axios';

async function verify_nip05(profile, pubkey): Promise<void> {
	if (profile.nip05 != undefined) {
		var nip05_local = profile.nip05.split('@')[0];
		var nip05_domain = profile.nip05.split('@')[1];
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
