const profileModel = require("../../models/profileSchema");
module.exports = {
	aliases: ["wd"],
	description: "Withdraw coins from your bank",
	cooldown: 5,
	usage: "!withdraw <number>",
	async execute(message, args, _0, _1, profileData) {
		const amount = parseInt(args[0]);
		if (isNaN(amount)) return "Enter a valid number";
		if (amount % 1 != 0 || amount <= 0) return "Withdraw amount must be a whole number";
		try {
			if (amount > profileData.bank) return "You don't have that amount of Minco Dollars in your bank.";
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					$inc: {
						mincoDollars: amount,
						bank: -amount,
					},
				}
			);
		} catch (err) {
			console.error(err);
		}
		await message.react("✅");
	},
};
