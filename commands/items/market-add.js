const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Add an item to your market!",
	aliases: ["ma"],
	usage: "!market-add <price> <item name> | <item description>",
	async execute(message, args, _0, _1, profileData) {
		if (args.length < 1) return "Valid usage: !market-add <price> <item name>";
		const price = parseInt(args[0]);
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
					},
				},
			}
		);
		if (desc) {
			message.channel.send(
				`**${title}** | ${desc} for ${price} MD has been added to your market.`
			);
		} else {
			message.channel.send(`**${title}** for ${price} MD has been added to your market.`);
		}
	},
};