const ms = require("ms");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Buy items from a user's market!",
	aliases: ["mb"],
	usage: "!market-buy <@user> <item>",
	async execute(message, args) {
		if (args.length < 1) return "Valid usage: !market-add <price> <item name>";
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";
		args.shift();
		const item = args.join(" ");
		const profile = await profileModel.findOne({ userID: message.author.id });
		if (!hasItem(item, profile)) return `<@${mention.id}> does not have that item! (remember capitalization)`;
		const i = getItem(item, profile);
		if (profileData.mincoDollars < i.price) {
			message.channel.send(`You do not have ${i.price} MD (price) in your wallet.`);
		}
		const msg = await message.channel.send(`Confirm by reacting to buy **${i.name}** for ${i.price} MD.`);
		msg.react("✅");
		const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
		const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
		reactionCollector.on("collect", async () => {
			await profileModel.findOneAndUpdate(
				{
					userID: mention.id,
				},
				{
					$inc: {
						mincoDollars: i.price,
					},
					$pull: {
						market: {
							name: item,
						},
					},
				}
			);
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$inc: {
						mincoDollars: -i.price,
					},
					$push: {
						market: i,
					},
				}
			);
			message.channel.send(`You bought **${i.name}** for **${i.price}** MD!`);
		});
	},
};
function hasItem(item, profileData) {
	for (const { name } of profileData.market) {
		if (item == name) return true;
	}
	return false;
}

function getItem(item, profileData) {
	for (const m of profileData.market) {
		if (item == m.name) return m;
	}
}
