module.exports = {
	description: "Remove items from your market",
	usage: "!market-remove <item name>",
	aliases: ["mr"],
	async execute(message, args, _0, _1, profileData) {
		if (!args.length) return "Valid usage: !market-add <ITEM NUMBER>";
		const item = args[0];
		if (!hasItem(item, profileData)) return "You don't have this item! (remember capitalization)";
		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$pull: {
					market: {
						item,
					},
				},
			}
		);

		message.channel.send(`The item number ${itemNumber} has been removed from your market.`);
	},
};

function hasItem(item, profileData) {
	for (const { name } of profileData.market) {
		if (item == name) return true;
	}
	return false;
}
