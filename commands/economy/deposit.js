const profileModel = require("../../models/profileSchema");

module.exports = {
	name: "deposit",
	aliases: ["dep"],
	description: "Despoit coins into your bank",
	usage: "!deposit <number>",
	cooldown: 5,
	async execute(message, args, _0, _1, profileData) {
		const amount = parseInt(args[0]);
		if (isNaN(amount)) return "Enter a valid number";
		if (amount % 1 != 0 || amount <= 0) return "Deposit amount must be a whole number";
		try {
			if (amount > profileData.mincoDollars) return "You don't have that amount of Minco Dollars to deposit.";
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$inc: {
						mincoDollars: -amount,
						bank: amount,
					},
				}
			);
		} catch (err) {
			console.error(err);
		}
		message.channel.send(`You deposited ${amount} Minco Dollars into your bank.`);
	},
};
