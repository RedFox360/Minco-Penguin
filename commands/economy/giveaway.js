const Discord = require("discord.js");
const profileModel = require("../../models/profileSchema");

module.exports = {
	name: "giveaway",
	description: "[can only be used by Angela and Sameer] Creates a giveaway!",
	usage: "!giveaway <@user 1> <@user 2> ...",
	async execute(message) {
		if (
			message.author.id == "804755578702266399" ||
			message.author.id == "724786310711214118"
		) {
			var options = [1, 25, 50, 75, 100];

			var users = message.mentions.users.array();
			if (!users) return message.channel.send("Mention at least 1 user");
			var randomUser = users[Math.floor(Math.random() * users.length)];
			var randomAmount = options[Math.floor(Math.random() * options.length)];
			await profileModel.findOneAndUpdate(
				{ userID: randomUser.id },
				{
					$inc: {
						mincoDollars: randomAmount,
					},
				}
			);
			message.channel.send(
				`<@${randomUser.id}> won the giveaway! They won ${randomAmount} Minco Dollars`
			);
		} else {
			message.channel.send(
				"This command can only be used by Angela and Sameer"
			);
		}
	},
};
