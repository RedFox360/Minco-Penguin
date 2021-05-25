const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Add an item to your market! Add an 'o' after your price to make it orbs.",
	aliases: ["ma"],
	usage: "!market-add <price> <item name> | <item description>",
	async execute(message, args, _0, _1, profileData) {
		if (args.length < 1) return "Valid usage: !market-add <price> <item name>";
		const p = args[0];
		let orbs = false;
		let price = parseInt(p);
		if (p.endsWith("o")) {
			orbs = true;
			price = parseInt(p.slice(0, -1));
		}
		if (isNaN(price)) return "Enter a valid price";
		if (price > 1000) return "Your price cannot be greater than 1000";
		args.shift();
		let [title, desc] = args.join(" ").split(" | ");
		for (const m of profileData.market) {
			if (title.toLowerCase() == m.name.toLowerCase()) {
				return "You already have this item in your market!";
			}
		}
		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$push: {
					market: {
						name: title,
						desc,
						price,
						orbs,
					},
				},
			}
		);
		const oomStr = orbs ? "MD" : "Orbs";
		if (desc) {
			message.channel.send(`**${title}** | ${desc} for ${price} ${oomStr} has been added to your market.`);
		} else {
			message.channel.send(`**${title}** for ${price} ${oomStr} has been added to your market.`);
		}
	},
};
