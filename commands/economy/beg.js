const profileModel = require("../../models/profileSchema");
module.exports = {
	cooldown: 240, //4 minutes
	aliases: ["gimmemoney"],
	description: "Beg for Minco Dollars",
	async execute(message, _0, cmd, _1, profileData) {
		let money = cmd === "gimmemoney" ? 2 : 4;
		let numberEcon = Math.floor(Math.random() * money) + 1;
		if (profileData.spouse != null) {
			random = Math.floor(Math.random() * 100);
			if (random <= 7) {
				// 7% chance
				numberEcon *= 2;
				message.channel.send("You got a double bonus for marriage!");
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
