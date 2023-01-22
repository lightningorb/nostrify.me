import { print } from '$lib/utils.ts';
import { bech32, fromWords, toWords } from '$lib/bech32.js';

// Helper function to convert a number to its hex character representation
const hex_char = (val: number): string => {
	if (val < 10) {
		return String.fromCharCode(48 + val);
	} else if (val < 16) {
		return String.fromCharCode(97 + val - 10);
	}
};

// Helper function to convert a Uint8Array to its hexadecimal string representation
const hex_encode = (buf: Uint8Array): string => {
	let str = '';
	let i = 0;
	// Iterate through the Uint8Array and convert each byte to its hexadecimal representation
	while (i < buf.length) {
		str += hex_char(buf[i] >> 4);
		str += hex_char(buf[i] & 0xf);
		i++;
	}
	return str;
};

// Convert a bech32 encoded key to a hexadecimal string
export const key_to_hex_key = (key: string): string => {
	// Decode the bech32 encoded key
	const decoded = bech32.decode(key);
	// Get the words from the decoded key
	const words = decoded.words;
	// Convert the words to an encoded Uint8Array
	const encoded = fromWords(words);
	// Encode the Uint8Array to a hexadecimal string
	return hex_encode(encoded);
};

export const hex_key_to_key = (prefix: string, hex_key: string): string => {
	// Create a Uint8Array with length equal to half of the hex_key string
	const bytes = new Uint8Array(hex_key.length / 2);
	let i = 0;
	// Iterate through the hex_key string and convert each pair of characters to its corresponding byte value
	while (i < hex_key.length) {
		bytes[i / 2] = parseInt(hex_key.substring(i, i + 2), 16);
		i += 2;
	}
	// Convert the bytes back to its bech32 encoded format using the provided prefix
	return bech32.encode(prefix, toWords(bytes));
};

// A class that represents a key
export default class Key {
	key: string;

	constructor(key: string) {
		// Ensure that the key is of type string
		if (typeof key !== 'string') {
			throw new Error('Invalid key type, expected string');
		}
		this.key = key;
		return this;
	}

	// Check if the key is a note key
	is_note(): boolean {
		return this.key.slice(0, 4) === 'note';
	}

	// Returns the key as a hexadecimal string if it is a note key, otherwise returns the key as is
	as_hex(): string {
		if (this.is_note()) {
			return key_to_hex_key(this.key);
		} else {
			return this.key;
		}
	}
}
