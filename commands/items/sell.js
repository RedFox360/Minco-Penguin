const profileModel = require("../../models/profileSchema");
const removeValue = require("../../functions/removeValue");
module.exports = {
	description: "Sell your items!",
	usage: "!sell <item number>",
	async execute(message, args, _0, _1, profileData) {
		const itemNumber = args[0];
		if (!itemNumber) return "Enter an item number";
		if (!profileData.inventory.includes(itemNumber)) return "You don't have that item!";
		const prices = [75, 1000, 25, 4, 12, 75, 400];
		const inv = removeValue(itemNumber, profileData.inventory);
		const price = prices[parseInt(itemNumber) - 1];
		const mention = message.mentions.users.first();
		const price = args[2];
		if (mention && price) {
			message.channel.send(
				`<@${
					mention.id
				}>, ${message.author.toString()} has offered to sell their item ${itemNumber} for ${price} MD.\nAccept by reacting with a check mark.`
			);
			msg.react("✅");
			const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === mention.id;
			const reactionCollector = msg.createReactionCollector(filter, { time: ms("3m") });
			reactionCollector.on("collect", () => {
				sell(message, price, inv, itemNumber, client, true);

				await profileModel.findOneAndUpdate(
					{
						userID: mention.id,
					},
					{
						$push: {
							inventory: itemNumber,
						},
						mincoDollars: -price,
					}
				);
				message.channel.send(`${message.author.toString()}, you succesfully sold your item!`);
				reactionCollector.stop();
			});
		}
		if (price >= 75) {
			const msg = message.channel.send("React to sell your item");
			msg.react("✅");
			const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
			const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
			reactionCollector.on("collect", () => {
				sell(message, price, inv, itemNumber, client, false);
			});
		} else {
			sell(message, price, inv, itemNumber, client, false);
		}
	},
};
async function sell(message, price, inv, itemN, client, actualPrice) {
	const amount = actualPrice ? price : Math.round(price / 2 / 5) * 5;
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
