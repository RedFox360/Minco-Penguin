const { Message, Client } = require("discord.js");
const profileModel = require("../../models/profileSchema");
const ms = require("ms");
module.exports = {
	description: "Buy items!",
	usage: "!buy (item number)",
	/** @param {Message} message */
	async execute(message, args, _0, client, profileData) {
		if (args[0] == "01") {
			buy(message, "Marriage Ring", 75, "01", profileData, client);
		} else if (args[0] == "02") {
			buy(message, "Diamond Crown", 1000, "02", profileData, client);
		} else if (args[0] == "03") {
			buy(message, "Cowboy Hat", 25, "03", profileData, client);
		} else if (args[0] == "04") {
			buy(message, "Tomato", 4, "04", profileData, client);
		} else {
			return "Enter a valid item number";
		}
	},
};

/** @param {Message} message */
async function buy(message, item, price, itemNumber, profileData, client) {
	if (profileData.inventory.includes(itemNumber)) return message.channel.send("You already have this item!");
	if (profileData.mincoDollars < price) return message.channel.send(`You need ${price} Minco Dollars to buy this item`);
	const msg = await message.channel.send(`React to buy a **${item}**`);
	await msg.react("✅");
	const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
	const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
	reactionCollector.on("collect", async () => {
		message.channel.send(`Buying a ${item}...`);
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: {
					mincoDollars: -price,
				},
			}
		);
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$push: {
					inventory: itemNumber,
				},
			}
		);
		message.channel.send(`You succesfully bought a ${item}!`);
		if (itemNumber == "02") {
			const carrelCrew = client.guilds.cache.get("785642761814671381");
			const role = carrelCrew.roles.cache.get("842053621402173501");
			const member = carrelCrew.members.cache.get(message.author.id);
			member.roles.add(role);
		}
		reactionCollector.stop();
	});
}
