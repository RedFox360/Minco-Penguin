const profileModel = require("../../models/profileSchema");

module.exports = {
	description: "[OWNER ONLY] give a user an amount of Minco Dollars",
	usage: "!giveuser <@user> <number>",
	async execute(message, args) {
		if (message.author.id == "724786310711214118") {
			const mention = message.mentions.users.first();
			if (!mention) return "Mention a valid user";
			const amount = parseInt(args[1]);
			if (isNaN(amount)) return "Enter a valid number";
			await profileModel.findOneAndUpdate(
				{ userID: mention.id },
				{
					$inc: {
						mincoDollars: amount,
					},
				}
			);
			message.channel.send(`You have given <@${mention.id}> ${amount} Minco Dollars`);
		}
	},
};
