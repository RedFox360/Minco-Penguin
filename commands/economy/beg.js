const randomInt = require("../../functions/random");
const profileModel = require("../../models/profileSchema");
module.exports = {
	cooldown: "3.5m",
	aliases: ["gimmemoney"],
	description: "Beg for Minco Dollars",
	async execute(message, _0, cmd, _1, profileData) {
		let numberEcon = cmd === "gimmemoney" ? 1 : randomInt(1, 3);
		if (profileData.inventory.includes("05")) {
			if (profileData.candyAmount <= 0) {
				await profileModel.findOneAndUpdate(
					{ userID: message.author.id },
					{
						$pull: {
							inventory: "05",
						},
					}
				);
			} else {
				await profileModel.findOneAndUpdate(
					{
						userID: message.author.id,
					},
					{
						$inc: {
							candyAmount: -1,
						},
					}
				);
				numberEcon *= 2;
				message.channel.send("You got a double bonus from your candy!");
			}
		}
		if (profileData.spouse != null || profileData.inventory.includes("07")) {
			random = Math.floor(Math.random() * 100);
			const chance = profileData.spouse != null ? 10 : 5;
			const mOrB = profileData.spouse != null ? "for marriage" : "from your bear";
			if (random < chance) {
				numberEcon *= 2;
				message.channel.send(`You got a double bonus ${mOrB}!`);
			}
		}
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: { mincoDollars: numberEcon },
			}
		);
		let mdString = numberEcon == 1 ? "Dollar" : "Dollars";
		message.channel.send(`You received ${numberEcon} Minco ${mdString}!`);
	},
};
