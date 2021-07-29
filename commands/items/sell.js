module.exports = {
	description: "Sell your items",
	usage: "!sell <item number>",
	async run(message, args, _0, _1, profileData) {
		const item = args[0];
		if (!item) return;
		if (!profileData.inventory.includes(item)) return "You don't have that item!";

		const sellableItems = ["01", "02", "03", "06", "07", "08", "09"];
		const index = sellableItems.indexOf(item);
		if (index == -1) return "You can't sell that item!";
		const returnAmounts = [40, 500, 15, 40, 250, 30, 30, 30];
		const returnAmount = returnAmounts[index];

		const msg = await message.channel.send(
			`React to sell item number ${item} in return: ${returnAmount} MD`
		);
		msg.react("✅");
		const filter = (reaction, user) =>
			reaction.emoji.name === "✅" && user.id === message.author.id;

		const collector = msg.createReactionCollector(filter, { time: 30000, limit: 1 });
		collector.on("collect", async () => {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					$pull: { inventory: item },
					$inc: { mincoDollars: returnAmount },
				}
			);
			return "You succesfully sold your item";
		});
	},
};
