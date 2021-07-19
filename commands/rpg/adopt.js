const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Adopt a penguin. Types are Warrior (w), Magician (m), Healer (h), and Archer (a)",
	usage: "!adopt <type>",
	async execute(message, args) {
		if (!args.length) return "Valid types: Warrior (w), Magician (m), Healer (h), and Archer (a)";
		const adoptionEmbed = new MessageEmbed().setAuthor("Adoption", message.author.avatarURL());
		if (args[0] == "Warrior" || args[0] == "w") {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					penguin: "w",
				}
			);

			adoptionEmbed
				.setDescription("You adopted a warrior penguin!")
				.setImage(
					"https://cdn.discordapp.com/attachments/866741907702546462/866789277244194856/penguin_warrior.png"
				)
				.setColor("#bdc3c7");
		} else if (args[0] == "Magician" || args[0] == "m") {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					penguin: "m",
				}
			);
			adoptionEmbed
				.setDescription("You adopted a magician penguin!")
				.setImage(
					"https://cdn.discordapp.com/attachments/866741907702546462/866743740315205642/penguin_magician.png"
				)
				.setColor("#21618c");
		} else if (args[0] == "Healer" || args[0] == "h") {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					penguin: "h",
				}
			);
			adoptionEmbed
				.setDescription("You adopted a healer penguin!")
				.setImage(
					"https://cdn.discordapp.com/attachments/866741907702546462/866743740438020126/penguin_healer.png"
				)
				.setColor("#e74c3c");
		} else if (args[0] == "Archer" || args[0] == "a") {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					penguin: "a",
				}
			);
			adoptionEmbed
				.setDescription("You adopted an archer penguin!")
				.setImage(
					"https://cdn.discordapp.com/attachments/866741907702546462/866789269514092554/penguin_archer.png"
				)
				.setColor("#239b56");
		} else {
			return "Valid types: Warrior (w), Magician (m), Healer (h), and Archer (a)";
		}

		message.channel.send(adoptionEmbed);
	},
};
