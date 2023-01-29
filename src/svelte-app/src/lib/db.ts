import { getRandomInt } from '$lib/utils.ts';
import initSqlJs from 'sql.js';
import { print, toBinString, toBinArray } from '$lib/utils.ts';
import { create_table } from '$lib/orm.ts';
import { preferences } from '$lib/store.ts';
import { Profile, Note } from '$lib/interfaces.ts';

class Database {
	constructor() {
		return this;
	}

	init(SQL: any) {
		let data = null; //window?.sessionStorage.getItem('mydata3');
		if (data) {
			this.db = new SQL.Database(toBinArray(data));
		} else {
			print('NO Session Storage data - initializing db');
			this.db = new SQL.Database();
			this.db.run(create_table('data', ...[
				['id', 'TEXT PRIMARY KEY'],
				['pubkey', 'TEXT'],
				['created_at', 'INTEGER'],
				['kind', 'INTEGER'],
				['tags', 'TEXT'],
				['content', 'TEXT'],
				['sig', 'TEXT']
			]));
			this.db.run(create_table('profile', ...[
				['id', 'TEXT PRIMARY KEY'],
				['relay', 'TEXT'],
				['name', 'TEXT'],
				['pubkey', 'TEXT'],
				['nip05', 'TEXT'],
				['nip05checked', 'INTEGER'],
				['nip05valid', 'INTEGER'],
				['npub', 'TEXT'],
				['website', 'TEXT'],
				['picture', 'TEXT'],
				['about', 'TEXT'],
				['checking_profile', 'INTEGER'],
				['profile_checked', 'INTEGER'],
				['profile_check_requested', 'INTEGER']
			]));
		}
	}

	insert_profile(data, pubkey, relay = '') {
		if (!pubkey) return;
		let res = this.db.exec("SELECT * FROM profile WHERE pubkey = '" + pubkey + "'");
		if (res.length == 0) {
			var doc = {
				':id': getRandomInt(0, 100000000).toString(),
				':relay': relay,
				':name': data.name || '',
				':pubkey': pubkey,
				':nip05': data.nip05 || '',
				':nip05checked': data.nip05checked === true ? 1 : 0,
				':nip05valid': data.nip05valid === true ? 1 : 0,
				':npub': data.npub || '',
				':website': data.website || '',
				':picture': data.picture || '',
				':about': data.about || '',
				':checking_profile': data.checking_profile === true ? 1 : 0,
				':profile_checked': data.profile_checked === true ? 1 : 0,
				':profile_check_requested': data.profile_check_requested === true ? 1 : 0
			};
			this.db.run(
				'INSERT INTO profile VALUES (:id, :relay, :name, :pubkey, :nip05, :nip05checked, :nip05valid, :npub, :website, :picture, :about, :checking_profile, :profile_checked, :profile_check_requested)',
				doc
			);
		}
	}

	insert_data(data: Note) {
		let res = this.db.exec("SELECT * FROM data WHERE id = '" + data.id + "'");
		if (res.length == 0) {
			this.db.run(
				'INSERT INTO data VALUES (:id, :pubkey, :created_at, :kind, :tags, :content, :sig)',
				{
					':id': data.id,
					':pubkey': data.pubkey,
					':created_at': data.created_at,
					':kind': data.kind,
					':tags': JSON.stringify(data.tags),
					':content': data.content,
					':sig': data.sig
				}
			);
			if (data.kind == 1) {
				if (this.get_profile(data.pubkey) == undefined) {
					this.insert_blank_profile(data.pubkey);
				}
			}
		}
	}

	update_profile(data, pubkey, relay='') {
		if (!pubkey) return;
		this.db.exec("DELETE FROM profile WHERE pubkey = '" + pubkey + "'");
		this.insert_profile(data, pubkey, relay);
	}

	insert_blank_profile(pubkey) {
		var doc = {
			relay: '',
			name: '',
			pubkey: pubkey,
			nip05: '',
			nip05checked: 0,
			nip05valid: 0,
			npub: '',
			website: '',
			picture: '',
			about: '',
			checking_profile: 0,
			profile_checked: 0,
			profile_check_requested: 0
		};
		this.insert_profile(doc, pubkey);
	}

	save() {
		// sessionStorage.setItem('mydata3', toBinString(this.db.export()));
	}

	get_data(max: number) {
		let stmt = this.db.prepare(
			'SELECT * FROM data WHERE kind=:kindval ORDER BY created_at DESC LIMIT ' + max
		);
		stmt.getAsObject({ ':kindval': 1 });
		stmt.bind({ ':kindval': 1 });
		let ret = [];
		while (stmt.step()) {
			ret.push(stmt.getAsObject());
		}
		return ret;
	}

	get_profile_posts(max: number, pubkey: string) {
		let stmt = this.db.prepare(
			'SELECT * FROM data WHERE (kind=:kindval AND pubkey=:pubkeyval) ORDER BY created_at DESC LIMIT ' +
				max
		);
		stmt.getAsObject({ ':kindval': 1, ':pubkeyval': pubkey });
		stmt.bind({ ':kindval': 1, ':pubkeyval': pubkey });
		let ret = [];
		while (stmt.step()) {
			ret.push(stmt.getAsObject());
		}
		return ret;
	}

	get_profiles_that_need_nip05_check() {
		let stmt = this.db.prepare(
			'SELECT * FROM profile WHERE (nip05checked=:nip05checkedval AND profile_checked=:profile_checkedval)'
		);
		let query_obj = { ':nip05checkedval': 0, ':profile_checkedval': 1 };
		stmt.getAsObject(query_obj);
		stmt.bind(query_obj);
		let ret = [];
		while (stmt.step()) {
			ret.push(stmt.getAsObject());
		}
		return ret;
	}

	get_profiles_that_need_checking() {
		let stmt = this.db.prepare(
			'SELECT * FROM profile WHERE (profile_check_requested=:profile_check_requestedval AND profile_checked=:profile_checkedval AND checking_profile=:checking_profileval)'
		);
		let query_obj = {
			':profile_checkedval': 0,
			':checking_profileval': 0,
			':profile_check_requestedval': 1
		};
		stmt.getAsObject(query_obj);
		stmt.bind(query_obj);
		let ret = [];
		while (stmt.step()) {
			ret.push(stmt.getAsObject());
		}
		return ret;
	}
	get_related(e: string) {
		let stmt = this.db.prepare('SELECT * FROM data WHERE kind=:kindval ORDER BY created_at ASC');
		stmt.getAsObject({ ':kindval': 1 });
		stmt.bind({ ':kindval': 1 });
		let r = [];
		while (stmt.step()) {
			let doc = stmt.getAsObject();
			for (let t of JSON.parse(doc.tags)) {
				if (t[0] == 'e' && t[1] == e) {
					r.push(doc);
				}
			}
		}
		return r;
	}

	get_note(hex_key: string) {
		let doc = this.db
			.prepare('SELECT * FROM data WHERE id=:idval')
			.getAsObject({ ':idval': hex_key });
		if (doc?.id) {
			return doc;
		}
	}

	get_profile(pubkey: string) {
		if (pubkey) {
			let doc = this.db
				.prepare('SELECT * FROM profile WHERE pubkey=:pubkeyval')
				.getAsObject({ ':pubkeyval': pubkey });
			if (doc?.pubkey !== undefined) {
				return doc;
			}
		}
	}
}

var db = new Database();

export default db;
