const profileModel = require("../../models/profileSchema");

module.exports = {
	description: "[OWNER ONLY] give a user an amount of Minco Dollars",
	usage: "!giveuser <@user> <number>",
	async execute(message, args) {
		const cl = message.author.id == "802668636795830292";
		const ow = message.author.id == "724786310711214118";
		if (cl || ow) {
			const mention = message.mentions.users.first();
			if (!mention) return "Mention a valid user";
			if (cl && mention.id == "802668636795830292")
				return message.reply("you cannot give money to yourself");
			const amount = parseInt(args[1]);
			if (isNaN(amount)) return "Enter a valid number";
			if (cl && amount < 100) return message.reply("you cannot give an amount greater than 100");
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
