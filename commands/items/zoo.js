const { MessageEmbed } = require("discord.js");
module.exports = {
	description: "View your Minco Zoo!",
	execute(message, args, _1, _2, profileData) {
		const animals = [];

		for (let i = 1; i <= profileData.zoo.length; i++) {
			const end = i % 5 === 0 ? "\n" : " ";
			if (args[0] == "list") {
				const { name, emoji } = profileData.zoo[i - 1];
				let animal = `${emoji} ${name}\n`;
				animals.push(animal);
			} else {
				let animal = profileData.zoo[i - 1].emoji + end;
				animals.push(animal);
			}
		}

		const zoo = new MessageEmbed()
			.setAuthor(message.member.nickname || message.author.username, message.author.avatarURL())
			.setColor("#F4D03F")
			.setTitle("Minco Zoo")
			.setDescription(animals.join(""));

		message.channel.send(zoo);
	},
};
