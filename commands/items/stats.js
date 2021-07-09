const { MessageEmbed } = require("discord.js");
const calculatePower = require("../../functions/calculatePower");
module.exports = {
	description: "View your battle stats",
	async execute(message) {
		const mention = message.mentions.users.first();
		const author = mention ?? message.author;
		const [attack, defense, health] = await calculatePower(author.id);
		const statsEmbed = new MessageEmbed()
			.setAuthor("Stats", author.avatarURL())
			.setColor("#F5B041")
			.addFields(
				{
					name: ":fire:Attack",
					value: attack,
					inline: true,
				},
				{
					name: ":crossed_swords: Defense",
					value: defense,
					inline: true,
				},
				{
					name: ":heart: Health",
					value: health,
					inline: true,
				}
			)
			.guildFooter(message);
		message.channel.send(statsEmbed);
	},
};
