const ALPHABET: string = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const ALPHABET_MAP: Record<string, number> = {};

for (let i = 0; i < ALPHABET.length; i++) {
	const char = ALPHABET.charAt(i);
	ALPHABET_MAP[char] = i;
}

function polymodStep(pre: number): number {
	const b = pre >> 25;
	return (
		((pre & 0x1ffffff) << 5) ^
		(-((b >> 0) & 1) & 0x3b6a57b2) ^
		(-((b >> 1) & 1) & 0x26508e6d) ^
		(-((b >> 2) & 1) & 0x1ea119fa) ^
		(-((b >> 3) & 1) & 0x3d4233dd) ^
		(-((b >> 4) & 1) & 0x2a1462b3)
	);
}

function prefixChk(prefix: string): number | string {
	let chk = 1;
	for (let i = 0; i < prefix.length; ++i) {
		const c = prefix.charCodeAt(i);
		if (c < 33 || c > 126) return 'Invalid prefix (' + prefix + ')';
		chk = polymodStep(chk) ^ (c >> 5);
	}
	chk = polymodStep(chk);
	for (let i = 0; i < prefix.length; ++i) {
		const v = prefix.charCodeAt(i);
		chk = polymodStep(chk) ^ (v & 0x1f);
	}
	return chk;
}

function convertbits(
	data: number[],
	inBits: number,
	outBits: number,
	pad: boolean
): number[] | string {
	let value = 0;
	let bits = 0;
	const maxV = (1 << outBits) - 1;
	const result: number[] = [];
	for (let i = 0; i < data.length; ++i) {
		value = (value << inBits) | data[i];
		bits += inBits;
		while (bits >= outBits) {
			bits -= outBits;
			result.push((value >> bits) & maxV);
		}
	}
	if (pad) {
		if (bits > 0) {
			result.push((value << (outBits - bits)) & maxV);
		}
	} else {
		if (bits >= inBits) return 'Excess padding';
		if ((value << (outBits - bits)) & maxV) return 'Non-zero padding';
	}
	return result;
}

export function toWords(bytes: number[]): number[] {
	return convertbits(bytes, 8, 5, true);
}

function fromWordsUnsafe(words: number[]): number[] | undefined {
	const res = convertbits(words, 5, 8, false);
	if (Array.isArray(res)) return res;
}

export function fromWords(words: number[]): number[] {
	const res = convertbits(words, 5, 8, false);
	if (Array.isArray(res)) return res;
	throw new Error(res);
}

function getLibraryFromEncoding(encoding: string) {
	let ENCODING_CONST: number;
	if (encoding === 'bech32') {
		ENCODING_CONST = 1;
	} else {
		ENCODING_CONST = 0x2bc830a3;
	}

	function encode(prefix: string, words: number[], LIMIT?: number) {
		LIMIT = LIMIT || 90;
		if (prefix.length + 7 + words.length > LIMIT) throw new TypeError('Exceeds length limit');
		prefix = prefix.toLowerCase();
		// determine chk mod
		var chk = prefixChk(prefix);
		if (typeof chk === 'string') throw new Error(chk);
		var result = prefix + '1';
		for (var i = 0; i < words.length; ++i) {
			var x = words[i];
			if (x >> 5 !== 0) throw new Error('Non 5-bit word');
			chk = polymodStep(chk) ^ x;
			result += ALPHABET.charAt(x);
		}
		for (var i = 0; i < 6; ++i) {
			chk = polymodStep(chk);
		}
		chk ^= ENCODING_CONST;
		for (var i = 0; i < 6; ++i) {
			var v = (chk >> ((5 - i) * 5)) & 0x1f;
			result += ALPHABET.charAt(v);
		}
		return result;
	}
	function __decode(str, LIMIT) {
		LIMIT = LIMIT || 90;
		if (str.length < 8) return str + ' too short';
		if (str.length > LIMIT) return 'Exceeds length limit';
		// don't allow mixed case
		var lowered = str.toLowerCase();
		var uppered = str.toUpperCase();
		if (str !== lowered && str !== uppered) return 'Mixed-case string ' + str;
		str = lowered;
		var split = str.lastIndexOf('1');
		if (split === -1) return 'No separator character for ' + str;
		if (split === 0) return 'Missing prefix for ' + str;
		var prefix = str.slice(0, split);
		var wordChars = str.slice(split + 1);
		if (wordChars.length < 6) return 'Data too short';
		var chk = prefixChk(prefix);
		if (typeof chk === 'string') return chk;
		var words = [];
		for (var i = 0; i < wordChars.length; ++i) {
			var c = wordChars.charAt(i);
			var v = ALPHABET_MAP[c];
			if (v === undefined) return 'Unknown character ' + c;
			chk = polymodStep(chk) ^ v;
			// not in the checksum?
			if (i + 6 >= wordChars.length) continue;
			words.push(v);
		}
		if (chk !== ENCODING_CONST) return 'Invalid checksum for ' + str;
		return { prefix: prefix, words: words };
	}
	function decodeUnsafe(str: string, LIMIT?: number): object | undefined {
		const res = __decode(str, LIMIT);
		if (typeof res === 'object') return res;
	}

	function decode(str: string, LIMIT?: number): object {
		const res = __decode(str, LIMIT);
		if (typeof res === 'object') return res;
		throw new Error(res);
	}
	return {
		decodeUnsafe: decodeUnsafe,
		decode: decode,
		encode: encode,
		toWords: toWords,
		fromWordsUnsafe: fromWordsUnsafe,
		fromWords: fromWords
	};
}

export const bech32 = getLibraryFromEncoding('bech32');
export const bech32m = getLibraryFromEncoding('bech32m');
