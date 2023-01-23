const print = (x: any) => console.log(x);
const toBinString = (arr: any[]) =>
	new Uint8Array(arr).reduce((acc, cur) => acc + String.fromCharCode(cur), '');
const toBinArray = (str: string) => new Uint8Array(str.split('').map((c) => c.charCodeAt(0)));
const getRandomInt = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;
export { print, toBinString, toBinArray, getRandomInt };

console.assert(toBinString([72, 101, 108, 108, 111]) === 'Hello');
console.assert(toBinArray('Hello').toString() === '72,101,108,108,111');
const randomNum = getRandomInt(5, 10);
console.assert(randomNum >= 5 && randomNum <= 10);
