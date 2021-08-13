const { isInteger } = require("mathjs");
module.exports = {
	description: "Check if a number is a perfect square",
	usage: "!square <number>",
	aliases: ["perfect-square", "psq"],
	run(_, args) {
		let number = parseInt(args[0]);
		if (isNaN(number)) return "Enter a valid number";
		const isSquare = isInteger(Math.sqrt(number));
		if (isSquare) return `${number} is a perfect square`;
		else return `${number} is not a perfect square`;
	},
};
