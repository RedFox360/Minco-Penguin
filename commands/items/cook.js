const profileModel = require("../../models/profileSchema");
module.exports = {
	description:
		"Cook your items!\nEgg values: boiled, scrambled, omelette\nPrices: 6 MD for boiled or scrmabled, 8 MD for omelette",
	usage: "!cook egg <egg type>",
	async execute(message, args, _0, _1, profileData) {
		if (!profileData.inventory.includes("11")) return "You don't have a raw egg!";
		let price;
		if (args[0] == "boiled") {
			price = cook(6, "11-0", profileData, message.author.id);
		} else if (args[0] == "scrambled") {
			price = cook(8, "11-1", profileData, message.author.id);
		} else if (args[0] == "omelette") {
			price = cook(8, "11-2", profileData, message.author.id);
		} else return "Enter a valid egg type";

		const eggName = args[0] == "omelette" ? args[0] : `${args[0]} egg`;
		message.channel.send(`You cooked an ${eggName} for ${price} MD`);
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
			$push: {
				inventory: itemN,
			},
		}
	);
	return price;
}
