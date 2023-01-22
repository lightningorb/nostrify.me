import pool from '$lib/pool.coffee';
import db from '$lib/db.coffee'
import { print } from '$lib/utils.coffee'
import { preferences } from '$lib/store.js'
import { get } from 'svelte/store'
import { browser, dev } from '$app/environment'
import { RelayPool } from 'nostr'

class Subscriptions
  constructor: ->
    @timer = 0
    @sub_pubkeys = new Set([])
    @is_init = false
    return @
  init: ->
    # this could cause race conditions
    if @is_init
      return
    @is_init = true
    on_event = (relay, sub_id, ev) ->
      if sub_id == 'event_ids'
        db.insert_identity_data ev
      return
    pool.add_event_callback on_event
  main: (pubkey) =>
    clearTimeout @timer
    obj = @
    if not db.get_identity pubkey
      @sub_pubkeys.add(pubkey)
    @timer = setTimeout((->
      pool.pool.unsubscribe('event_ids')
      pool.pool.subscribe('event_ids', {
        kinds: [0],
        authors: [...obj.sub_pubkeys]
      });
      return
    ), 2000)
    return

subs = new Subscriptions()
export default subs = subs