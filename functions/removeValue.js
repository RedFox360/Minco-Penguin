function removeValue(value, array) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] === value) {
			array.splice(i, 1);
			i--;
		}
	}
	return array;
}

module.exports = removeValue;
