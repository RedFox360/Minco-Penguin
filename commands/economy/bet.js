const profileModel = require("../../models/profileSchema");
const { Message } = require("discord.js");
module.exports = {
	name: "bet",
	description: "Bet a number of your coins on a random outcome",
	cooldown: 10,
	usage: "!bet <number>",
	/** @param {Message} message */
	async execute(message, args, _0, _1, profileData) {
		let random = Math.floor(Math.random() * 2);
		let amount = parseInt(args[0]);
		if (isNaN(amount)) return message.channel.send("Enter a valid number");
		if (amount > profileData.mincoDollars)
			return message.channel.send(`You don't have ${amount} Minco Dollars.`);
		if (amount <= 0)
			return message.channel.send(
				"You have to bet a positive number of Minco Dollars"
			);
		if (amount > 20)
			return message.channel.send("You can't bet more than 20 Minco Dollars");
		if (random == 1) {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					$inc: {
						mincoDollars: -amount,
					},
				}
			);
			message.channel.send(`You lost! You lost ${amount} Minco Dollars.`);
		} else {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					$inc: {
						mincoDollars: amount,
					},
				}
			);
			message.channel.send(`You won! You have earned ${amount} Minco Dollars!`);
		}
	},
};
