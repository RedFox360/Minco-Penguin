const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Add an item to your market!",
	aliases: ["ma"],
	usage: "!market-add <price> <item name> | <item description>",
	async execute(message, args, _0, _1, profileData) {
		if (args.length < 1) return "Valid usage: !market-add <price> <item name>";
		const price = parseInt(args[0]);
		if (isNaN(price)) return "Enter a valid price";
		args.shift();
		let [title, desc] = args.join(" ").split("|");
		for (const m of profileData.market) {
			if (title.toLowerCase() == m.name.toLowerCase()) {
				return "You already have this item in your market!";
			}
		}
		const toPush =
			desc == undefined
				? {
						name: title,
						price,
				  }
				: {
						name: title,
						desc,
						price,
				  };
		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$push: {
					market: toPush,
				},
			}
		);

		message.channel.send(`**${td[0]}** ${td[1]} for ${price} MD has been added to your market.`);
	},
};
