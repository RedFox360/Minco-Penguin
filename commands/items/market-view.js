const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View the market of a user!",
	usage: "!market-view <@user>",
	aliases: ["mv"],
	async execute(message) {
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user!";
		const profile = await profileModel.findOne({ userID: mention.id });

		if (!profile.market.length) return `<@${mention.id}> does not have anything in their market`;

		const marketEmbed = new MessageEmbed()
			.setColor("#D1F2EB")
			.setTitle("Market")
			.setDescription(`User: <@${mention.id}>`)
			.setFooter(message.guild.name);
		for (const { name, price, desc } of profile.market) {
			const value = desc == undefined ? `Price: ${price} MD` : `Price: ${price} MD\n${desc}`;
			marketEmbed.addField(`${name}`, value);
		}
		message.channel.send(marketEmbed);
	},
};
