const ms = require("ms");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Buy items from a user's market!",
	aliases: ["mb"],
	usage: "!market-buy <@user> <item>",
	async run(message, args, _0, _1, profileData) {
		if (args.length < 1) return "Valid usage: !market-buy <@user> <item>";
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";
		args.shift();
		const item = args.join(" ");
		const profile = await profileModel.findOne({ userID: mention.id });
		if (!hasItem(item, profile))
			return `<@${mention.id}> does not have that item! (remember capitalization)`;
		const i = getItem(item, profile);
		if (profileData.mincoDollars < i.price) return `You do not have ${i.price} MD (price).`;
		const msg = await message.channel.send(
			`Confirm by reacting to buy **${i.name}** for ${i.price} MD.`
		);
		msg.react("✅");
		const filter = (reaction, user) =>
			reaction.emoji.name === "✅" && user.id === message.author.id;
		msg.awaitReactions(filter, { time: ms("30s"), max: 1 }).then("collect", async () => {
			await profileModel.findOneAndUpdate(
				{
					userID: mention.id,
				},
				{ $inc: { mincoDollars: i.price } }
			);
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{ $inc: { mincoDollars: -i.price } }
			);
			mention.send(`${message.author.toString()} has bought your **${i.name}**!`);
			message.channel.send(
				`You bought **${i.name}** for **${i.price}** MD! <@${mention.id}> will be DMed notifying your purchase.`
			);
		});
	},
};
function hasItem(item, profileData) {
	for (const m of profileData.market) {
		if (item == m.name) return true;
	}
	return false;
}

function getItem(item, profileData) {
	for (const m of profileData.market) {
		if (item == m.name) return m;
	}
}
