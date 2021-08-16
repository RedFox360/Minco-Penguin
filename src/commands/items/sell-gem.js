const { default: profileModel } = require("../../models/profileSchema");
const ms = require("ms");
const gems = require("../../functions/gems.json");
module.exports = {
	description: "Sell your gems!",
	usage: "!sell <gem number>",
	async run(message, args, _0, _1, profileData) {
		const itemNumber = args[0];
		if (!itemNumber) return "Enter an item number";
		if (!profileData.inventory.includes(itemNumber))
			return "You don't have that item!";
		let price, name;
		for (const g of gems[1]) {
			if (g.number == itemNumber) {
				price = g.price;
				name = g.name;
			}
		}
		if (price >= 75) {
			const msg = await message.channel.send(`React to sell your ${name}`);
			msg.react("✅");
			const filter = (reaction, user) =>
				reaction.emoji.name === "✅" && user.id === message.author.id;
			const reactionCollector = msg.createReactionCollector(filter, {
				time: ms("30s"),
			});
			reactionCollector.on("collect", () => {
				sell(message, price, itemNumber, name);
			});
		} else {
			sell(message, price, itemNumber, name);
		}
	},
};
async function sell(message, price, itemN, name) {
	const amount = Math.round(price / 2 / 5) * 5;
	await profileModel.findOneAndUpdate(
		{ userID: message.author.id },
		{
			$inc: {
				mincoDollars: amount,
			},
			$pull: {
				gem: itemN,
			},
		}
	);
	message.channel.send(`You sold your ${name} for ${amount} MD`);
}
