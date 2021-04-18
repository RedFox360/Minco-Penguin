const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "[ADMIN ONLY] Reset someone's bank",
	usage: "!reset <@user>",
	async execute(message) {
		if (message.author.id == "724786310711214118") {
			const mention = message.mentions.users.first();
			const profile = await profileModel.findOne({ userID: mention.id });
			await profileModel.findOneAndUpdate(
				{ userID: mention.id },
				{
					userID: mention.id,
					serverID: message.guild.id,
					mincoDollars: 100,
					bank: 0,
					birthday: profile.birthday,
					favs: {
						food: profile.favs.food,
						color: profile.favs.color,
						animal: profile.favs.animal,
					},
				}
			);
			message.channel.send(`Profile for <@${mention.id}> has been reset.`);
		}
	},
};
