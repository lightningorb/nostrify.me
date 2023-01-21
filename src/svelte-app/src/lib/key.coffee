import { print } from '$lib/utils.coffee'
import { bech32, fromWords, toWords } from '$lib/bech32.js'

hex_char = (val) ->
  if val < 10
    String.fromCharCode(48 + val)
  else if val < 16
    String.fromCharCode(97 + val - 10)

hex_encode = (buf) ->
  [str, i] = ['', 0]
  i = 0
  while i < buf.length
    str += hex_char(buf[i] >> 4)
    str += hex_char(buf[i] & 0xF)
    i++
  str

export key_to_hex_key = (key) -> hex_encode fromWords bech32.decode(key).words

export hex_key_to_key = (prefix, hex_key) ->
  [bytes, i] = [new Uint8Array(hex_key.length / 2), 0]
  while i < hex_key.length
    bytes[i / 2] = parseInt(hex_key.substring(i, i + 2), 16)
    i += 2
  bech32.encode(prefix, toWords(bytes))

export default class Key
  constructor: (key) ->
    @key = key
    return @
  is_note: ->
    @key.slice(0, 4) is 'note'
  as_hex: ->
    if @is_note()
        key_to_hex_key(@key)
    else
        @key