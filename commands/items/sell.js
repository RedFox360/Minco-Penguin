const profileModel = require("../../models/profileSchema");
const basics = require("../../functions/basics.json");
module.exports = {
	description: "Sell your items!",
	usage: "!sell <item number>",
	async execute(message, args, _0, client, profileData) {
		const itemNumber = args[0];
		if (!itemNumber) return "Enter an item number";
		if (!profileData.inventory.includes(itemNumber)) return "You don't have that item!";
		let price, name;
		for (const b of basics) {
			if (b.number == itemNumber) {
				price = b.price;
				name = b.name;
			}
		}
		if (price >= 75) {
			const msg = message.channel.send("React to sell your item");
			msg.react("✅");
			const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
			const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
			reactionCollector.on("collect", () => {
				sell(message, price, itemNumber, client, name);
			});
		} else {
			sell(message, price, itemNumber, client, name);
		}
	},
};
async function sell(message, price, itemN, client, name) {
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
	message.channel.send(`You sold your ${name} for ${amount} MD`);
}
