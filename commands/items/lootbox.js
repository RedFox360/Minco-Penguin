const profileModel = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
const gems = require("../../functions/gems.json");
module.exports = {
	description: "Use your lootbox!",
	cooldown: "10m",
	async execute(message, _0, _1, _2, profileData) {
		if (!profileData.inventory.includes("10")) return "You don't have a lootbox!";

		const mincoAmount = randomInt(20, 60);
		const gems = gems[0];
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: {
					mincoDollars: mincoAmount,
				},
			}
		);
		if (Math.floor(Math.random() * 3) == 0) {
			let gem = gems[Math.floor(Math.random() * gems.length)];

			while (profileData.inventory.includes(gem)) {
				gem = gems[Math.floor(Math.random() * gems.length)];
			}
			let gemName;
			for (let { number, name } of gems[1]) {
				if (gem == number) gemName = name;
			}
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					$push: {
						gems: gems,
					},
				}
			);
			message.channel.send(`You won a ${gemName}!`);
		}

		message.channel.send(`You won ${mincoAmount} Minco Dollars!`);
	},
};
