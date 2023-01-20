import { bech32, fromWords, toWords } from '$lib/bech32.js'

function hex_char(val)
{
    if (val < 10)
        return String.fromCharCode(48 + val)
    if (val < 16)
        return String.fromCharCode(97 + val - 10)
}

function hex_encode(buf)
{
    var str = ""
    for (let i = 0; i < buf.length; i++) {
        const c = buf[i]
        str += hex_char(c >> 4)
        str += hex_char(c & 0xF)
    }
    return str
}

export function key_to_hex_key(key) {
    const decoded = bech32.decode(key)
    const bytes = fromWords(decoded.words)
    return hex_encode(bytes);
}

export function hex_key_to_key(hex_key) {
    var bytes = new Uint8Array(hex_key.length / 2);
    for (var i = 0; i < hex_key.length; i += 2) {
        bytes[i / 2] = parseInt(hex_key.substring(i, i + 2), 16);
    }
    var words = toWords(bytes);
    var prefix = "note";
    var key = bech32.encode(prefix, words);
    return key;
}
