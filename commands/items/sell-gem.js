const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Sell your gems!",
	usage: "!sell <gem number>",
	async execute(message, args, _0, _1, profileData) {
		const itemNumber = args[0];
		if (!itemNumber) return "Enter an item number";
		if (!profileData.inventory.includes(itemNumber)) return "You don't have that item!";
		const price = args[2];
		if (price >= 75) {
			const msg = message.channel.send("React to sell your item");
			msg.react("✅");
			const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
			const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
			reactionCollector.on("collect", () => {
				sell(message, price, itemNumber);
			});
		} else {
			sell(message, price, itemNumber);
		}
	},
};
async function sell(message, price, itemN) {
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
	message.channel.send(`You sold your item for ${amount} MD`);
}
