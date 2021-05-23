const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View the market of a user!",
	usage: "!market-view (@user)",
	aliases: ["mv"],
	async execute(message, _0, _1, _2, profileData) {
		const mention = message.mentions.users.first();
		let profile = profileData;
		let id = message.author.id;
		if (mention) {
			profile = await profileModel.findOne({ userID: mention.id });
			id = mention.id;
		}
		const market = profile.market;
		if (!market.length) return `<@${mention.id}> does not have anything in their market`;
		market.sort((a, b) => b.price - a.price);
		await profileModel.findOneAndUpdate(
			{
				userID: mention.id,
			},
			{
				market,
			}
		);
		const marketEmbed = new MessageEmbed()
			.setColor("#D1F2EB")
			.setTitle("Market")
			.setDescription(`User: <@${id}>`)
			.setFooter(message.guild.name);
		for (const { name, price, desc } of market) {
			const value = desc == undefined ? `Price: ${price} MD` : `Price: ${price} MD\n${desc}`;
			marketEmbed.addField(`${name}`, value);
		}
		message.channel.send(marketEmbed);
	},
};
