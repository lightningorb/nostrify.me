/*
 * @Author: lnorb.com
 * @Date:   2023-01-27 14:46:40
 * @Last Modified by:   lnorb.com
 * @Last Modified time: 2023-01-28 08:12:40
 */

interface Observer {
  update: (data: any) => void;
}

export interface Profile {
	name: string;
	website: string;
	npub: string;
	picture: string;
	about: string;
	nip05: string;
	nip05valid: boolean;
	nip05checked: boolean;
	checking_profile: boolean;
	profile_checked: boolean;
}

export interface Note {
	id: string;
	pubkey: string;
	created_at: number;
	kind: number;
	tags: string;
	content: string;
	sig: string;
}
