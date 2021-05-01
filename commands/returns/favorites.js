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
			id = mention.id;
			avatarURL = mention.avatarURL();
		} else {
			id = message.author.id;
			avatarURL = message.author.avatarURL();
		}
		let profile = await profileModel.findOne({ userID: id });
		var { animal, color, food } = profile.favs;
		var embedColor = "82E0AA"; //light green

		(() => {
			if (!color) return;
			let lcolor = color.toLowerCase();
			let colors = ["red", "orange", "yellow", "green", "blue", "purple"];
			for (let colorT of colors) {
				if (lcolor.includes(colorT)) embedColor = colorT.toUpperCase();
				return;
			}
		})();
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
