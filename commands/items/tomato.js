const removeValue = require("../../functions/removeValue");
const profileModel = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
module.exports = {
	description: "Use your tomato! Get between 2 and 6 Minco Dollars",
	cooldown: 90,
	async execute(message, _0, _1, _2, profileData) {
		if (!profileData.inventory.includes("04")) return "You don't have a tomato!";
		const numberEcon = randomInt(2, 6);
		const inv = removeValue("04", profileData.inventory);
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
					inventory: inv,
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
				inventory: inv,
			}
		);
		message.channel.send(`You ate your fresh tomato and won ${numberEcon} Minco Dollars!`);
	},
};
