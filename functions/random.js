/**
 * Simple random command
 * @param {number} min The minimum number, included
 * @param {number} max The maximum number, included
 */
function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = randomIntFromInterval;
