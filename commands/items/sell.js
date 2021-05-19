const profileModel = require("../../models/profileSchema");
const ms = require("ms");
const basics = require("../../functions/basics.json");
module.exports = {
	description: "Sell your items!",
	usage: "!sell <item number>",
	async execute(message, args, _0, client, profileData) {
		const itemNumber = args[0];
		if (!itemNumber) return "Enter an item number";
		if (!profileData.inventory.includes(itemNumber)) return "You don't have that item!";
		let price;
		for (const b of basics) {
			if (b.number == itemNumber) {
				price = b[1];
			}
		}
		if (price >= 75) {
			const msg = await message.channel.send("React to sell your item");
			msg.react("✅");
			const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
			const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
			reactionCollector.on("collect", () => {
				sell(message, price, itemNumber, client);
			});
		} else {
			sell(message, price, itemNumber, client);
		}
	},
};
async function sell(message, price, itemN, client) {
	const amount = Math.round(price / 2 / 5) * 5;
	await profileModel.findOneAndUpdate(
		{ userID: message.author.id },
		{
			$inc: {
				mincoDollars: amount,
			},
			$pull: {
				inventory: itemN,
			},
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
