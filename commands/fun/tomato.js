const removeValue = require("../../functions/removeValue");
const profileModel = require("../../models/profileSchema");
const { randomInt } = require("mathjs");
module.exports = {
	description: "Use your tomato!",
	async execute(message, _0, _1, _2, profileData) {
		if (!profileData.inventory.includes("04")) return message.channel.send("You don't have a tomato!");
		const numberEcon = randomInt(2, 6);
		const inv = removeValue("04", profileData.inventory);
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
