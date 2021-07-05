export function addUID(data) {
	return data.map((row, index) => ({
		'uid': index,
		...row
	}))
}

export function roundTo(number, to) {
	let n = Math.pow(10, to)
	return Math.floor(number * n) / n
}

export function downloadObjectAsJSON(exportObj, exportName) {
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
	var downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", exportName + ".json");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

export function downloadObjectAsCSV(exportObj, exportName) {

	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonToCsv(exportObj));
	var downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", exportName + ".csv");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

export function jsonToCsv(json) {

	let keys = Object.keys(json[0])
	if (keys.length == 0)
		return ''

	var replacer = function (key, value) { return value === null ? '' : value }
	var csv = json.map((row) => {
		return keys.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
	})

	csv.unshift(keys.join(',')) // add header column
	csv = csv.join('\r\n');
	return csv
}