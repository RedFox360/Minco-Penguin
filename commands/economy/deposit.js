const profileModel = require("../../models/profileSchema");

module.exports = {
	aliases: ["dep"],
	description: "Deposit Minco Dollars into your bank",
	usage: "!deposit <number>",
	async execute(message, args, _0, _1, profileData) {
		const amount = parseInt(args[0]);
		if (isNaN(amount)) return "Enter a valid number";
		if (amount <= 0) return "Deposit amount must be a positive number";
		try {
			if (amount > profileData.mincoDollars)
				return "You don't have that amount of Minco Dollars to deposit.";
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
		await message.react("✅");
	},
};
