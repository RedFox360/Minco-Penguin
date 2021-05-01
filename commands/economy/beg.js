const profileModel = require("../../models/profileSchema");
module.exports = {
	cooldown: 240, //4 minutes
	aliases: ["gimmemoney"],
	description: "Beg for Minco Dollars",
	async execute(message, _, cmd) {
		let money = cmd === "gimmemoney" ? 2 : 4;
		let numberEcon = Math.floor(Math.random() * money) + 1;
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: { mincoDollars: numberEcon },
			}
		);
		let mdString = numberEcon == 1 ? "Dollars" : "Dollar";
		message.channel.send(`You received ${numberEcon} Minco ${mdString}!`);
	},
};
