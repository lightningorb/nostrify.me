const print = (x: any) => console.log(x);
const toBinString = (arr: any[]) =>
	new Uint8Array(arr).reduce((acc, cur) => acc + String.fromCharCode(cur), '');
const toBinArray = (str: string) => new Uint8Array(str.split('').map((c) => c.charCodeAt(0)));
const getRandomInt = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;
const hash_profile_filler = (str: string) =>
	(str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 3) + 1;
const breakLongWords = (sentence) =>
	sentence
		.split(' ')
		.map((word) => (word.length > 30 ? word.match(/.{1,30}/g).join(' ') : word))
		.join(' ');

// interface String {
//   startswith: (str) => {
//   	return this.slice(0, str.length) == str
//   }; // <-- Whatever signature you want.
// }

export { print, toBinString, toBinArray, getRandomInt, hash_profile_filler, breakLongWords };

console.assert(toBinString([72, 101, 108, 108, 111]) === 'Hello');
console.assert(toBinArray('Hello').toString() === '72,101,108,108,111');
const randomNum = getRandomInt(5, 10);
console.assert(randomNum >= 5 && randomNum <= 10);
