import initSqlJs from 'sql.js'
import {print} from '$lib/utils.coffee'
import { preferences } from '$lib/store.js'

SQL = await initSqlJs()

toBinString = (arr) ->
  uarr = new Uint8Array(arr)
  strings = []
  chunksize = 0xffff
  i = 0
  while i * chunksize < uarr.length
    strings.push String.fromCharCode.apply(null, uarr.subarray(i * chunksize, (i + 1) * chunksize))
    i++
  strings.join ''

toBinArray = (str) ->
  l = str.length
  arr = new Uint8Array(l)
  i = 0
  while i < l
    arr[i] = str.charCodeAt(i)
    i++
  arr



class Database
  constructor: ->
    return @
  init: =>
    data = localStorage.getItem('mydata')
    if data?
      @db = new (SQL.Database)(toBinArray(data))
    else
      print("NO DB")
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
      @db.run("INSERT INTO data VALUES (:id, :pubkey, :created_at, :kind, :tags, :content, :sig)", {':id': data.id, ':pubkey': data.pubkey, ':created_at': data.created_at, ':kind': data.kind, ':tags': data.tags, ':content': data.content, ':sig': data.sig})
  save: ->
    window.localStorage.setItem("mydata", toBinString(@db.export()));
  get_data: (max) =>
    stmt = @db.prepare("SELECT * FROM data WHERE kind=:kindval ORDER BY created_at DESC LIMIT #{max}")
    stmt.getAsObject({':kindval' : 1})
    stmt.bind({':kindval' : 1})
    while stmt.step()
      stmt.getAsObject()

db = new Database()
export default db = db