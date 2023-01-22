import { print } from '$lib/utils.coffee'
import { preferences } from '$lib/store.js'
import { get } from 'svelte/store'
import { browser, dev } from '$app/environment'
import { RelayPool } from 'nostr'

class Pool
  constructor: ->
    @callbacks = []
    @event_callbacks = []
    return @
  init: =>
    prefs = get(preferences)
    if browser and prefs.public_key is ''
      prefs.private_key = window.NostrTools.generatePrivateKey()
      prefs.public_key = window.NostrTools.getPublicKey(prefs.private_key)
      preferences.set(prefs)
    @pool = RelayPool(prefs.relays)
    @pool.on 'open', (relay) =>
      for cb in @callbacks
        cb(relay)
    @pool.on 'event', (relay, sub_id, ev) =>
      for cb in @event_callbacks
        cb(relay, sub_id, ev)
    return @pool
  add_callback: (cb) =>
    @callbacks.push(cb)
  clear_callbacks: () =>
    @callbacks = []
  add_event_callback: (cb) =>
    @event_callbacks.push(cb)

pool = new Pool()
export default pool = pool