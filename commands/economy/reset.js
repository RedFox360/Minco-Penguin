const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "[ADMIN ONLY] Reset someone's bank",
	usage: "!reset <@user>",
	async execute(message) {
		if (message.author.id == "724786310711214118") {
			const mention = message.mentions.users.first();
			await profileModel.findOneAndUpdate(
				{ userID: mention.id },
				{
					mincoDollars: 100,
					bank: 0,
				}
			);
			message.channel.send(`Minco Dollars for <@${mention.id}> has been reset.`);
		}
	},
};
