module.exports = {
	description: "Remove items from your market",
	usage: "!market-remove <item number>",
	aliases: ["mr"],
	async execute(message, args, _0, _1, profileData) {
		if (!args.length) return "Valid usage: !market-add <ITEM NUMBER>";
		const itemNumber = parseInt(args[0]);
		if (isNaN(itemNumber)) return "Enter a valid number ";
		let number;
		for (const m of profileData.market) {
			if (itemNumber == m.number) number = m.number;
		}
		const number = market.length + 1;
		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$pull: {
					market: {
						number,
					},
				},
			}
		);

		message.channel.send(`The item number ${itemNumber} has been removed from your market.`);
	},
};
