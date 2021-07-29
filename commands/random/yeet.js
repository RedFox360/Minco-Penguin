module.exports = {
	description: "Sends a random yeet gif",
	run(message, args) {
		const yeets = [
			"https://tenor.com/view/yeet-lion-king-simba-rafiki-throw-gif-16194362",
			"https://tenor.com/view/see-ya-ya-yeet-ash-chucks-pikachu-im-sick-of-you-now-throw-gif-16987702",
			"https://tenor.com/view/rainbow-yeet-gif-14521966",
			"https://tenor.com/view/yeet-colorful-gif-15791260",
		];

		if (args[0] == "all") {
			yeets.forEach((yeet) => message.channel.send(yeet));
		} else {
			return yeets.rand();
		}
	},
};
