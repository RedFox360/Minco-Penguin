const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "[sameer only] Gives the green diamond to a user",
	usage: "!green-diamond <@user>",
	async execute(message) {
		if (message.author.id == "724786310711214118") {
			const mention = message.mentions.users.first();
			if (!mention) return "Mention a valid user";

			await profileModel.findOneAndUpdate(
				{
					userID: mention.id,
				},
				{
					$push: {
						gems: "157",
					},
				}
			);

			message.channel.send(`You gave the exclusive GREEN DIAMOND to <@${mention.id}>`);
		}
	},
};
