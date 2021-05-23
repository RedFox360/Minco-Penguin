const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "[sameer only] Gives the ametrine to a user",
	usage: "!green-diamond <@user>",
	async execute(message, args) {
		if (message.author.id == "724786310711214118") {
			const mention = message.mentions.users.first();
			if (!mention) return "Mention a valid user";
			if (!args[1]) return "Enter a gem number";
			await profileModel.findOneAndUpdate(
				{
					userID: mention.id,
				},
				{
					$push: {
						gems: args[1],
					},
				}
			);

			message.channel.send(`You gave an item ${args[1]} to <@${mention.id}>`);
		} else {
			message.channel.send("This command can only be used by Sameer");
		}
	},
};
