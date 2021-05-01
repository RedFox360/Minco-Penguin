const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Check the favorites of a user",
	usage: "!favorites <@user>",
	aliases: ["favs"],
	async execute(message) {
		var id;
		const mention = message.mentions.users.first();
		if (mention) {
			message.channel.send("Mention a valid user");
			id = mention.id;
		} else {
			id = message.author.id;
		}
		let profile = await profileModel.findOne({ userID: id });
		try {
			message.channel.send("Animal: " + profile.favs.animal);
			message.channel.send("Color: " + profile.favs.color);
			message.channel.send("Food: " + profile.favs.food);
		} catch (err) {
			console.error(err);
		}
	},
};
