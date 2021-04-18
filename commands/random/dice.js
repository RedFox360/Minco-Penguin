module.exports = {
	aliases: ["roll", "diceroll", "die"],
	description: "Roll a die (returns a random number between 1 and 6, inclusive)",
	execute() {
		let random = Math.floor(Math.random() * 6) + 1;
		return random.toString();
	},
};
