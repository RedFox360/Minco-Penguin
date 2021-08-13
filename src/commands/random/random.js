const randomInt = require("../../functions/random");
module.exports = {
	description: "Returns a random number between 2 numbers",
	aliases: ["rand"],
	usage: "!random <min number> <max number>",
	run(_, args) {
		let min = parseInt(args[0]);
		let max = parseInt(args[1]);
		if (isNaN(min) || isNaN(max)) return "Enter valid numbers";
		if (max <= min) return "Your second number must be greater than your first number";
		let random = randomInt(min, max);
		return random.toLocaleString();
	},
};