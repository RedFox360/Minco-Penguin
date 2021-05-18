const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View the market of a user!",
	usage: "!market-view <@user>",
	aliases: ["mv"],
	async execute(message, _0, _1, _2, profileData) {
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user!";
		const profile = await profileModel.findOne({ userID: mention.id });

		if (!profileData.market.length) return `<@${mention.id}> does not have anything in their market`;

		const market = profileData.market;
		const marketEmbed = new MessageEmbed()
			.setColor("#D1F2EB")
			.setTitle("Market")
			.setDescription(`User: <@${mention.id}>`)
			.setFooter(message.guild.name);
		for (const { number, name, price } of market) {
			marketEmbed.addField(`${name}`, `Price: ${price} MD`);
		}

		message.channel.send(marketEmbed);
	},
};
