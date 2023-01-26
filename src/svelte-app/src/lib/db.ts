import initSqlJs from 'sql.js';
import { print, toBinString, toBinArray } from '$lib/utils.ts';
import { preferences } from '$lib/store.ts';

interface Note {
	id: string;
	pubkey: string;
	created_at: number;
	kind: number;
	tags: string;
	content: string;
	sig: string;
}

class Database {
	constructor() {
		return this;
	}

	init(SQL: any) {
		let data = window?.sessionStorage.getItem('mydata2');
		if (data) {
			this.db = new SQL.Database(toBinArray(data));
		} else {
			print('NO Session Storage data - initializing db');
			this.db = new SQL.Database();
			let sqlstr =
				'CREATE TABLE data ( \
		        id TEXT PRIMARY KEY, \
		        pubkey TEXT , \
		        created_at INTEGER , \
		        kind INTEGER , \
		        tags TEXT , \
		        content TEXT , \
		        sig TEXT  \
		      ); \
      ';
			this.db.run(sqlstr);
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
		}
	}

	insert_identity_data(data: Note) {
		let res = this.db.exec("SELECT * FROM data WHERE kind = 0 AND pubkey = '" + data.pubkey + "'");
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
		}
	}

	update_identity_data(data: Note) {
		let res = this.db.exec("SELECT * FROM data WHERE kind = 0 AND pubkey = '" + data.pubkey + "'");
		if (res.length > 0) {
			this.db.run('DELETE FROM data WHERE pubkey = :pubkey', {
				':pubkey': data.pubkey
			});
			this.insert_identity_data(data);
		}
	}

	save() {
		sessionStorage.setItem('mydata2', toBinString(this.db.export()));
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
		let stmt = this.db.prepare('SELECT * FROM data WHERE id=:idval');
		let doc = stmt.getAsObject({ ':idval': hex_key });
		if (doc?.id) {
			return doc;
		}
	}

	get_identity(pubkey: string) {
		let stmt = this.db.prepare('SELECT * FROM data WHERE kind=0 AND pubkey = :pubkeyval');
		let doc = stmt.getAsObject({ ':pubkeyval': pubkey });
		if (doc?.pubkey) {
			return doc;
		}
	}
}

var db = new Database();

export default db;
