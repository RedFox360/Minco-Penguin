const { MessageEmbed } = require("discord.js");

module.exports = {
	description: "View your Minco Zoo!",
	execute(message, _0, _1, _2, profileData) {
		const animals = [];

		for (let i = 0; i < profileData.zoo.length; i++) {
			const end = i % 5 == 0 && i != 0 ? "\n" : " ";
			const animal = profileData.zoo[i].emoji + end;
			animals.push(animal);
		}

		const zoo = new MessageEmbed().setColor("#F4D03F").setTitle("Minco Zoo").setDescription(animals.join(""));

		message.channel.send(zoo);
	},
};
