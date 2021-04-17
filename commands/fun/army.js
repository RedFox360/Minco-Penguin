module.exports = {
	name: "army",
	description: "This is a test command for Minco Penguin",
	execute(message, args) {
		if (args[0] != null && args[0].toLowerCase().startsWith("carl"))
			return "Turtles🐢, Dolphins🐬, Lizards🦎, Monkeys🐵🐒, Birds🦜";
		else return "Penguins🐧, Candy bears🍬🐻, Blobfish, Doges, Vibing Cats, Jellyfish";
	},
};
