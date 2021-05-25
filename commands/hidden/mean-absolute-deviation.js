const { default: ordinal } = require("ordinal");

module.exports = {
	description: "Calculate the mean average deviation of a set of numbers",
	usage: "!mad <number 1> <number 2> ...",
	aliases: ["mad", "mean-ad", "mean-a-d"],
	execute(_, args) {
		if (!args.length) return "Enter valid arguments";
		const numbers = args.map((arg) => parseInt(arg));
		for (let i = 0; i < numbers.length; i++) {
			if (isNaN(numbers[i])) return `Enter a valid number at the ${ordinal(i + 1)} argument`;
		}

		return `MAD: ${mad(numbers)}`;
	},
};
function mad(numbers) {
	const average = numbers.reduce((a, b) => a + b) / numbers.length;
	const deviations = numbers.map((n) => {
		if (n < average) {
			return average - n;
		} else {
			return n - average;
		}
	});
	return deviations.reduce((a, b) => a + b) / deviations.length;
}
