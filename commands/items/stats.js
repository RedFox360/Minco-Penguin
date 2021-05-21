const { MessageEmbed } = require("discord.js");
const calculatePower = require("../../functions/calculatePower");
module.exports = {
	description: "View your battle stats",
	async execute(message) {
		const mention = message.mentions.users.first();
		let name = message.member.displayName;
		let avatarURL = message.author.avatarURL();
		if (mention) {
			name = message.guild.members.cache.get(mention.id).displayName;
			avatarURL = mention.avatarURL();
		}
		const [attack, defense, health] = await calculatePower(author.id);
		message.channel.send(
			new MessageEmbed().setAuthor(name, avatarURL).setTitle("Stats").setColor("#F5B041").setFooter(message.guild.name).addFields(
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
		);
	},
};
