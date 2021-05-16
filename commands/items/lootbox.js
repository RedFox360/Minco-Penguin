const profileModel = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
const gems = require("../../functions/gems.json");
module.exports = {
	description: "Use your lootbox!",
	cooldown: "10m",
	async execute(message, _0, _1, _2, profileData) {
		if (!profileData.inventory.includes("10")) return "You don't have a lootbox!";

		const mincoAmount = randomInt(40, 70);

		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: {
					mincoDollars: mincoAmount,
				},
				$pull: {
					inventory: "10",
				},
			}
		);
		if (Math.floor(Math.random() * 12) == 0) {
			const g = gems[0];
			let gem = g[Math.floor(Math.random() * g.length)];

			while (profileData.inventory.includes(gem)) {
				gem = g[Math.floor(Math.random() * g.length)];
			}
			let gemName;
			for (let { number, name } of gems[1]) {
				if (gem == number) gemName = name;
			}
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					$push: {
						gems: gem,
					},
				}
			);
			message.channel.send(`You won a ${gemName}!`);
		}
		if (Math.floor(Math.random() * 5) == 0 && !profileData.inventory.includes("05")) {
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$push: {
						inventory: "05",
					},
				}
			);

			message.channel.send("You won a Candy :candy:!");
		}

		message.channel.send(`You won ${mincoAmount} Minco Dollars!`);
	},
};
