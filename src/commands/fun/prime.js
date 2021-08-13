module.exports = {
	description: "checks if a number is prime or not",
	aliases: ["composite", "isprime"],
	usage: "!prime <number>",
	/** @param {string[]} args */
	run(_, args, cmd) {
		if (!args[0]) return "Please enter an argument (valid usage: !prime <Number>)";
		let numberString = args[0].replace(/,/g, "");
		let primeNumber = parseInt(numberString);
		if (isNaN(primeNumber)) return "Enter a valid number";
		if (primeNumber <= 0) return "Please enter a positive number";
		let composite = cmd === "composite";
		return isPrime(primeNumber, composite);
	},
};
/** @param {number} number */
function isPrime(number, useComposite) {
	let isPrimeText, isntPrimeText;
	if (useComposite) {
		isPrimeText = "isn't composite";
		isntPrimeText = "is composite";
	} else {
		isPrimeText = "is prime";
		isntPrimeText = "isn't prime";
	}
	if (number == 1) return "1 is neither prime nor composite";
	if (number == 2) return `${number.toLocaleString()} ${isPrimeText}`;
	for (let i = 2; i <= Math.ceil(Math.sqrt(number)); i++) {
		if (number % i == 0)
			return `${number.toLocaleString()} ${isntPrimeText} because it is divisible by ${i}`;
	}
	return `${number.toLocaleString()} ${isPrimeText}`;
}