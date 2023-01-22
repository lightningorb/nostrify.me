import { openDB, deleteDB, wrap, unwrap } from 'idb';

export function init_index_db() {
  return new Promise(async (resolve) => { 
  	if ((navigator && !navigator.storage) || navigator == undefined) return;
		const dbOpen = indexedDB.open('nostrify', 1);
		dbOpen.onupgradeneeded = (event) => {
			console.log(`upgrading database from ${event.oldVersion} to ${event.newVersion}...`);
			const db = dbOpen.result;
			switch (event.oldVersion) {
				case 0: {
          // const sql = db.createObjectStore('sql', { keyPath: 'id', autoIncrement: false });
					const note = db.createObjectStore('note', { keyPath: 'id', autoIncrement: false });
					// note.createIndex('dateIdx', 'created_at', { unique: false });
					// note.createIndex('tagsIdx', 'tags', { unique: false, multiEntry: true });
				}
			}
		};
		dbOpen.onsuccess = () => {
			const db = dbOpen.result;
      resolve(db);
		};
  })
}

var Database;
Database = (function() {
  function Database() {
    return this;
  }
  Database.prototype.insert_data = function(n) {
    localStorage.last_event = n.created_at;
    const writeTransaction = this.idb.transaction('note', 'readwrite'),
     note = writeTransaction.objectStore('note'),
     insert = note.add(n);
  };
  // Database.prototype.save_db = function(n) {
  //   console.log('saving', n.length)
  //   const writeTransaction = this.idb.transaction('note', 'readwrite'),
  //    sql = writeTransaction.objectStore('note'),
  //    note = sql.add({id: 0, data: n});
  // };
  Database.prototype.save_db = function(n) {
      const chunkSize = 1 * 1024;
      let chunks = [];
      console.log('n.length', n.length)
      for (let i = 0; i < n.length; i += chunkSize) {
          chunks.push(n.slice(i, i + chunkSize));
      }
      const writeTransaction = this.idb.transaction('note', 'readwrite'),
          sql = writeTransaction.objectStore('note');
      for (let i = 0; i < chunks.length; i++) {
          console.log('adding chunk id', i)
          sql.add({id: i, data: chunks[i]});
      }
  };
  Database.prototype.get_data = function() {
      return new Promise(async (resolve) => { 
          const reqTransaction = this.idb.transaction('note', 'readonly');
          const note = reqTransaction.objectStore('note');
          var chunks = '';
          note.openCursor().onsuccess = function(event) {
              var cursor = event.target.result;
              if (cursor) {
                  chunks += cursor.value.data;
                  cursor.continue();
              }
              else {
                  resolve(chunks);
              }
          };
      });
  }

  // Database.prototype.get_data = function() {
  //   return new Promise(async (resolve) => { 
  //       const reqTransaction = this.idb.transaction('note', 'readonly');
  //       const note = reqTransaction.objectStore('note');
  //       const request = note.get(0);
  //       request.onsuccess = () => {
  //         resolve(request.result ? request.result.data : null)
  //       };
  //       request.onerror = () => {
  //         console.log('note failure:', request.error);
  //       };
  //   });
  // }
  return Database;
})();

export const idb = new Database()