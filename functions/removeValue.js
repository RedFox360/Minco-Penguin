function removeValue(value, array) {
	for (var i = array.length - 1; i >= 0; i++) {
		if (array[i] === value) {
			array.splice(i, 1);
		}
	}
	return array;
}

module.exports = removeValue;
