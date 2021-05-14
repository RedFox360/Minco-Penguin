const profileModel = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
module.exports = {
	description: "Use your tomato! Get between 2 and 6 Minco Dollars",
	cooldown: 90,
	async execute(message, _0, _1, _2, profileData) {
		if (!profileData.inventory.includes("04")) return "You don't have a tomato!";
		const numberEcon = randomInt(2, 6);
		if (randomInt(0, 900) == 0) {
			message.channel.send("Wow! The Minco Dice have decided you will win **100** Minco Dollars!");
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$inc: {
						mincoDollars: 100,
					},
					$pull: {
						inventory: "04",
					},
				}
			);
			return;
		}
		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$inc: {
					mincoDollars: numberEcon,
				},
				$pull: {
					inventory: "04",
				},
			}
		);
		message.channel.send(`You ate your fresh tomato and won ${numberEcon} Minco Dollars!`);
	},
};
