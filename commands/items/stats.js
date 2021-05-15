const { MessageEmbed } = require("discord.js");
const calculatePower = require("../../functions/calculatePower");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View your battle stats",
	async execute(message, args, _0, _1, profileData) {
		const mention = message.mentions.users.first();
		let member = message.member;
		let author = message.author;
		if (mention) {
			member = message.guild.members.cache.get(mention.id);
			author = mention;
		}
		const [attack, defense, health] = await calculatePower(author.id);
		message.channel.send(
			new MessageEmbed()
				.setAuthor(member.nickname || author.username, author.avatarURL())
				.setTitle("Stats")
				.setColor("#F5B041")
				.setFooter(message.guild.name)
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
		);
	},
};
