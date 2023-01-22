import db from '$lib/db.coffee'
import { print } from '$lib/utils.coffee'
import { preferences } from '$lib/store.js'
import { get } from 'svelte/store'
import { browser, dev } from '$app/environment'
import { RelayPool } from 'nostr'

class Subscriptions
  constructor: ->
    return @
  main: ->
    # get all text notes
    # get their pubkeys
    # if we don't have an identity
    # sub to those identities

subs = new Subscriptions()
export default subs = subs