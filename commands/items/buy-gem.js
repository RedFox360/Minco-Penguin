const ms = require("ms");
module.exports = {
	description: "Buy a gem!",
	usage: "!buy <gem number>",
	execute(message, args, _0, _1, profileData) {
		if (args[0] == "01") {
			buyGem(message, "Blue Diamond <:blue_diamond:843178044894216202>", 100, "01", profileData);
		} else if (args[0] == "02") {
			buyGem(message, "Pink Diamond <:pink_diamond:843177780946010132>", 150, "02", profileData);
		} else if (args[0] == "03") {
			buyGem(message, "Emerald <:emerald:843180288984219689>", 150, "03", profileData);
		} else if (args[0] == "04") {
			buyGem(message, "Gold Bar <:gold_bar:843180638705287188>", 75, "04", profileData);
		} else if (args[0] == "05") {
			buyGem(message, "Sapphire <:sapphire:843182746050232340>", 100, "05", profileData);
		} else if (args[0] == "06") {
			buyGem(message, "Ruby <:ruby:843184456025112606>", 100, "06", profileData);
		} else if (args[0] == "07") [buyGem(message, "Amethyst <:amethyst:843184890337296454>", 100, "07", profileData)];
	},
};

async function buyGem(message, item, price, itemNumber, profileData) {
	if (profileData.inventory.includes(itemNumber)) return message.channel.send("You already have this item!");
	if (profileData.mincoDollars < price) return message.channel.send(`You need ${price} Minco Dollars to buy this item`);
	const msg = await message.channel.send(`React to buy a **${item}** for ${price} MD`);
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
				$push: {
					gems: itemNumber,
				},
			}
		);
		message.channel.send(`You succesfully bought a ${item}!`);
		reactionCollector.stop();
	});
	message.channel.send(`You bought a ${item} for ${price} MD`);
}
