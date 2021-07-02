export function addUID(data) {
	return data.map((row, index) => ({
		'uid': index,
		...row
	}))
}

export function roundTo(number, to){
	let n = Math.pow(10, to)
	return Math.floor(number * n) / n
}