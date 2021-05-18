const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Add an item to your market!",
	aliases: ["ma"],
	usage: "!market-add <price> <item name>",
	async execute(message, args, _0, _1, profileData) {
		if (args.length < 1) return "Valid usage: !market-add <price> <item name>";
		const price = args[0];
		args.shift();
		let name = args.join(" ");
		for (const m of profileData.market) {
			if (name.toLowerCase() == m.name.toLowerCase()) {
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
						name,
						price,
					},
				},
			}
		);

		message.channel.send(`**${name}** for ${price} MD has been added to your market.`);
	},
};
