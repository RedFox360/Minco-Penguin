const profileModel = require("../../models/profileSchema");
const removeValue = require("../../functions/removeValue");
module.exports = {
	description: "Sell your items!",
	usage: "!sell <item number>",
	execute(message, args, cmd, client, profileData) {
		const itemNumber = args[0];
		if (!itemNumber) return message.channel.send("Enter an item number");
		if (!profileData.inventory.includes(itemNumber)) return "You don't have that item!";
		const prices = [75, 1000, 25, 4, 12, 75, 400];
		const inv = removeValue(itemNumber, profileData.inventory);
		const price = prices[parseInt(itemNumber) - 1];

		if (price >= 75) {
			const msg = message.channel.send("React to sell your item");
			msg.react("✅");
			const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
			const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
			reactionCollector.on("collect", () => {
				sell(message, price, inv);
			});
		} else {
			sell(message, price, inv);
		}
	},
};

async function sell(message, price, inv) {
	const amount = Math.round(price / 2 / 5) * 5;
	await profileModel.findOneAndUpdate(
		{ userID: message.author.id },
		{
			$inc: {
				mincoDollars: amount,
			},
			inventory: inv,
		}
	);

	message.channel.send(`You sold your item for ${amount} MD`);
}
