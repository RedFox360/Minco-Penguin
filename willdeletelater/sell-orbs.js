const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Sell your orbs for money (1 orb = 10 MD)",
	usage: "!sell-orbs <number of orbs>",
	async execute(message, args, _0, _1, profileData) {
		const amount = parseInt(args[0]);
		if (isNaN(amount)) return "Enter a valid number";
		const price = amount * 10;
		const pl = amount == 1 ? "Orb" : "Orbs";
		if (profileData.orbs < amount) return `You don't have ${amount} ${pl.toLowerCase()}!`;
		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$inc: {
					mincoDollars: price,
					orbs: -amount,
				},
			}
		);

		message.channel.send(`You sold ${amount} ${pl} for ${price} MD`);
	},
};