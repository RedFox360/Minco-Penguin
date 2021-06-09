const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "[SAMEER ONLY] Reset someone's money, inv, and gems",
	usage: "!reset <@user>",
	async execute(message) {
		if (message.author.id == "724786310711214118") {
			const mention = message.mentions.users.first();
			await profileModel.findOneAndUpdate(
				{ userID: mention.id },
				{
					mincoDollars: 50,
					bank: 0,
					orbs: 5,
					zoo: [],
					inventory: [],
				}
			);
			message.channel.send(`Minco Dollars for <@${mention.id}> has been reset.`);
		}
	},
};
