const { MessageEmbed, Message } = require("discord.js");
const colors = require("discordjs-colors");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Check the favorites of a user",
	usage: "!favorites <@user>",
	aliases: ["favs"],
	/** @param {Message} message */
	async execute(message) {
		var id, avatarURL;
		const mention = message.mentions.users.first();
		if (mention) {
			id = mention.id;
			avatarURL = mention.avatarURL();
		} else {
			id = message.author.id;
			avatarURL = message.author.avatarURL();
		}
		let profile = await profileModel.findOne({ userID: id });
		var { animal, color, food } = profile.favs;
		var embedColor = "82E0AA"; //light green

		if (color) {
			let lcolor = color.toLowerCase();
			if (lcolor.includes("red")) embedColor = colors.red();
			else if (lcolor.includes("orange")) embedColor = colors.orange();
			else if (lcolor.includes("yellow")) embedColor = colors.gold();
			else if (lcolor.includes("dark green")) embedColor = colors.darkgreen();
			else if (lcolor.includes("green")) embedColor = colors.green();
			else if (lcolor.includes("tiffany blue")) embedColor = "0ABAB5";
			else if (lcolor.includes("blue")) embedColor = colors.blue();
			else if (lcolor.includes("dark purple")) embedColor = colors.darkpurple();
			else if (lcolor.includes("purple")) embedColor = colors.purple();
			else if (lcolor.includes("pink")) embedColor = colors.luminousvividpink();
		}
		message.channel.send(
			new MessageEmbed()
				.setTitle("Favorites")
				.setDescription(`User: <@${id}>`)
				.addFields(
					{
						name: "Animal",
						value: animal || "not set",
					},
					{
						name: "Color",
						value: color || "not set",
					},
					{
						name: "Food",
						value: food || "not set",
					}
				)
				.setColor(embedColor)
				.setThumbnail(avatarURL)
		);
	},
};
