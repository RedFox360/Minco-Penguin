function removeValue(value, array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === value) {
			array.splice(i, 1);
		}
	}
	return array;
}

module.exports = removeValue;
