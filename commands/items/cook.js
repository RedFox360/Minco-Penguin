const profileModel = require("../../models/profileSchema");
module.exports = {
	description:
		"Cook your items!\nEgg values: boiled, scrambled, omelette\nPrices: 6 MD for boiled, 7 MD for scrambled, 8 MD for omelette",
	usage: "!cook egg <egg type>",
	async run(message, args, _0, _1, profileData) {
		if (args[0] == "egg") {
			if (!profileData.inventory.includes("11")) return "You don't have a raw egg!";
			let price;
			if (args[1] == "boiled") {
				price = await cook(6, "11-0", profileData, message.author.id);
			} else if (args[1] == "scrambled") {
				price = await cook(7, "11-1", profileData, message.author.id);
			} else if (args[1] == "omelette") {
				price = await cook(8, "11-2", profileData, message.author.id);
			} else return "Enter a valid egg type";
			if (typeof price === "string") return price;
			const eggName = args[1] == "omelette" ? args[1] : `${args[1]} egg`;
			message.channel.send(`You cooked an ${eggName} for ${price} MD`);
		}
	},
};

async function cook(price, itemN, profileData, userID) {
	if (profileData.mincoDollars < price) return `You don't have ${price} MD in your wallet`;
	await profileModel.findOneAndUpdate(
		{ userID },
		{
			$inc: {
				mincoDollars: -price,
			},
			$pull: {
				inventory: "11",
			},
		}
	);
	await profileModel.findOneAndUpdate(
		{
			userID,
		},
		{
			$push: {
				inventory: itemN,
			},
		}
	);
	return price;
}
