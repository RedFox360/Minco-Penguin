const { MessageEmbed, Message } = require("discord.js");
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
			message.channel.send("Mention a valid user");
			id = mention.id;
			avatarURL = mention.avatarURL();
		} else {
			id = message.author.id;
			avatarURL = message.author.avatarURL();
		}
		let profile = await profileModel.findOne({ userID: id });
		var { animal, color, food } = profile.favs;
		message.channel.send(
			new MessageEmbed()
				.setTitle("Favorites")
				.setDescription(`User: <@${id}>`)
				.addFields(
					{
						name: "Animal",
						value: animal || "not set",
						inline: true,
					},
					{
						name: "Color",
						value: color || "not set",
						inline: true,
					},
					{
						name: "Food",
						value: food || "not set",
						inline: true,
					}
				)
				.setColor("82E0AA") // light green
				.setThumbnail(avatarURL)
		);
	},
};
