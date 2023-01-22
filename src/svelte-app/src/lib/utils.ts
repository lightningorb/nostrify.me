const print = (x: any) => {
	console.log(x);
};

const toBinString = (arr: any[]) => {
	const uarr = new Uint8Array(arr);
	const strings = [];
	const chunksize = 0xffff;
	let i = 0;
	while (i * chunksize < uarr.length) {
		strings.push(
			String.fromCharCode.apply(null, uarr.subarray(i * chunksize, (i + 1) * chunksize))
		);
		i++;
	}
	return strings.join('');
};

const toBinArray = (str: string) => {
	const l = str.length;
	const arr = new Uint8Array(l);
	let i = 0;
	while (i < l) {
		arr[i] = str.charCodeAt(i);
		i++;
	}
	return arr;
};

const getRandomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
};

export { print, toBinString, toBinArray, getRandomInt };
