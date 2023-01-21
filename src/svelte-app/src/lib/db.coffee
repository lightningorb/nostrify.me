import initSqlJs from 'sql.js'
import { print, toBinString, toBinArray } from '$lib/utils.coffee'
import { preferences } from '$lib/store.js'

class Database
  constructor: ->
    return @
  init: (SQL) =>
    data = window?.sessionStorage.getItem('mydata2')
    if data?
      @db = new (SQL.Database)(toBinArray(data))
    else
      print("NO Session Storage data - initializing db")
      @db = new SQL.Database()
      sqlstr = "CREATE TABLE data ( \
        id TEXT PRIMARY KEY, \
        pubkey TEXT , \
        created_at INTEGER , \
        kind INTEGER , \
        tags TEXT , \
        content TEXT , \
        sig TEXT  \
      ); \
      "
      @db.run(sqlstr)
  insert_data: (data) ->
    res = @db.exec("SELECT * FROM data WHERE id = '#{data.id}'")
    if res.length == 0
      @db.run("INSERT INTO data VALUES (:id, :pubkey, :created_at, :kind, :tags, :content, :sig)", {':id': data.id, ':pubkey': data.pubkey, ':created_at': data.created_at, ':kind': data.kind, ':tags': JSON.stringify(data.tags), ':content': data.content, ':sig': data.sig})
  save: ->
    sessionStorage.setItem("mydata2", toBinString(@db.export()));
  get_data: (max) =>
    stmt = @db.prepare("SELECT * FROM data WHERE kind=:kindval ORDER BY created_at DESC LIMIT #{max}")
    stmt.getAsObject({':kindval' : 1})
    stmt.bind({':kindval' : 1})
    while stmt.step()
      stmt.getAsObject()
  get_related: (e) =>
    stmt = @db.prepare("SELECT * FROM data WHERE kind=:kindval ORDER BY created_at ASC")
    stmt.getAsObject({':kindval' : 1})
    stmt.bind({':kindval' : 1})
    r = []
    while stmt.step()
      doc = stmt.getAsObject()
      tags = JSON.parse(doc.tags)
      for t in tags
        if t[0] == 'e' and t[1] == e
          r.push(doc)
    r
  get_note: (hex_key) =>
    stmt = @db.prepare("SELECT * FROM data WHERE id=:idval")
    doc = stmt.getAsObject({':idval' : hex_key})
    if doc?.id?
      doc

db = new Database()
export default db = db