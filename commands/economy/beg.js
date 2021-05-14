const profileModel = require("../../models/profileSchema");
module.exports = {
	cooldown: 240, //4 minutes
	aliases: ["gimmemoney"],
	description: "Beg for Minco Dollars",
	async execute(message, _0, cmd, _1, profileData) {
		let money = cmd === "gimmemoney" ? 2 : 4;
		let numberEcon = Math.floor(Math.random() * money) + 1;
		if (profileData.inventory.includes("05")) {
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

			if (profileData.candyAmount != 0) {
				numberEcon *= 2;
				message.channel.send("You got a double bonus from your candy!");
			} else {
				await profileModel.findOneAndUpdate(
					{ userID: message.author.id },
					{
						$pull: {
							inventory: "05",
						},
					}
				);
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
