module.exports = {
	description: "Sends a random yee gif",
	cooldown: 1,
	aliases: [
		"yeee",
		"yeeeee",
		"yeeeeee",
		"yeeeeeee",
		"yeeeeeeee",
		"yeeeeeeeee",
		"yeeeeeeeeee",
		"eeeeeeeeeee",
	],
	execute(message, args) {
		const yees = [
			"https://tenor.com/view/yee-yeedinasour-dinasour-gif-4930781",
			"https://tenor.com/view/yee-dinosaur-meme-smile-gif-15696659",
			"https://tenor.com/view/yeet-yee-yeee-meme-gif-13537661",
		];
		if (args[0] == "all") {
			yees.forEach((yee) => message.channel.send(yee));
		} else {
			return yees.rand();
		}
	},
};
