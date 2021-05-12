const { Message } = require("discord.js");
const profileModel = require("../../models/profileSchema");
const ms = require("ms");
module.exports = {
	description: "Buy items!",
	usage: "!buy (item number)",

	async execute(message, args, _0, _1, profileData) {
		if (args[0] == "01") {
			buy(message, "Marriage Ring", 75, "01");
		} else if (args[0] == "02") {
			buy(message, "Diamond Hat", 1000, "02");
		} else if (args[0] == "03") {
			buy(message, "Cowboy Hat", 1000, "03");
		} else if (args[0] == "04") {
			buy(message, "Tomato", 4, "04");
		} else {
			return "Enter a valid item number";
		}
	},
};
/** @param {Message} message */

async function buy(message, item, price, itemNumber) {
	if (profileData.mincoDollars < price) return message.channel.send("You need 75 Minco Dollars to buy this item");
	const msg = await message.channel.send(`React to buy a **${item}**`);
	const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
	const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
	reactionCollector.on("collect", () => {
		message.channel.send(`Buying a ${item}...`);
		await profileModel.findOneAndUpdate({
			$inc: {
				mincoDollars: -price,
			},
		});
		await profileModel.findOneAndUpdate({
			$push: {
				inventory: itemNumber,
			},
		});
		message.channel.send(`You succesfully bought a ${item}!`);
	});
}
