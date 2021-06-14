module.exports = {
	aliases: ["flip"],
	description: 'Returns "heads" or "tails" based on a random outcome.',
	execute: (_, args) =>
		(args[0] == "yn"
			? [":thumbsup: Yes", ":thumbsdown: No"]
			: [":coin: Heads", ":coin: Tails"]
		).rand(),
};
