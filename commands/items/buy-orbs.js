const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Buy orbs! 10 MD = 1 orb",
	usage: "!buy-orbs <number of orbs>",
	async execute(message, args, _0, _1, profileData) {
		const amount = parseInt(args[0]);
		if (isNaN(amount)) return "Enter a valid number";
		const price = amount * 10;
		if (profileData.mincoDollars < price) return `You need ${price} MD to buy this many orbs`;
		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$inc: {
					mincoDollars: -price,
					orbs: amount,
				},
			}
		);

		message.channel.send(`You bought ${amount} Orbs for ${price} MD`);
	},
};
