module.exports = {
	description: "Sting someone with your jellyfish!",
	cooldown: 25,
	run(message, _0, _1, _2, profileData) {
		if (!profileData.inventory.includes("06")) return "You don't have a jellyfish!";
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user!";
		const jellyGifs = [
			"https://tenor.com/view/jellyfish-beauteliful-sea-creature-gelif-15399956",
			"https://tenor.com/view/jellyfish-swimming-peace-light-sea-creature-gelif-14448183",
			"https://tenor.com/view/jelly-fish-jelly-ocean-fish-sea-gelif-4931976",
			"https://tenor.com/view/calming-gelif-6112322",
		];

		message.channel.send(jellyGifs.rand());
		message.channel.send(
			`${message.author.toString()} stung <@${mention.id}> using their jellyfish!`
		);
	},
};
