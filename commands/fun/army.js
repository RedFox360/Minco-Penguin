module.exports = {
	description: "This is a test command for Minco Penguin",
	execute: (_, args) =>
		args[0]?.toLowerCase().startsWith("carl")
			? "Turtles🐢, Dolphins🐬, Lizards🦎, Monkeys🐵🐒, Birds🦜"
			: "Penguins🐧, Candy bears🍬🐻, Blobfish, Doges, Vibing Cats, Jellyfish",
};
