const profileModel = require("../../models/profileSchema");
const removeValue = require("../../functions/removeValue");
module.exports = {
	description: "Sell your items!",
	usage: "!sell <item number>",
	execute(message, args, _0, _1, profileData) {
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
				sell(message, price, inv, itemNumber, client);
			});
		} else {
			sell(message, price, inv, itemNumber, client);
		}
	},
};
async function sell(message, price, inv, itemN, client) {
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
	if (itemN == "02") {
		const carrelCrew = client.guilds.cache.get("785642761814671381");
		const role = carrelCrew.roles.cache.get("842053621402173501");
		const member = carrelCrew.members.cache.get(message.author.id);
		member.roles.remove(role);
	}
	message.channel.send(`You sold your item for ${amount} MD`);
}
