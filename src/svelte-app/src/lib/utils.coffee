import { RelayPool } from 'nostr'
import { get } from 'svelte/store'
import { preferences } from '$lib/store.js'
import { browser, dev } from '$app/environment'

export print = (x) -> console.log x

export connect = ->
  prefs = get(preferences)
  if browser and prefs.public_key is ''
    prefs.private_key = window.NostrTools.generatePrivateKey()
    prefs.public_key = window.NostrTools.getPublicKey(prefs.private_key)
    preferences.set(prefs)
  RelayPool(prefs.relays)
