export function addUID(data) {
	return data.map((row, index) => ({
		'uid': index,
		...row
	}))
}
