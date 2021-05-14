const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View your battle stats",
	async execute(message, args, _0, _1, profileData) {
		const mention = message.mentions.users.first();
		let profile = profileData;
		let member = message.member;
		let author = message.author;
		if (mention) {
			profile = await profileModel.findOne({ userID: mention.id });
			member = message.guild.members.cache.get(mention.id);
			author = mention;
		}
		message.channel.send(
			new MessageEmbed()
				.setAuthor(member.nickname, author.username, author.avatarURL())
				.setTitle("Stats")
				.setColor("#F5B041")
				.setFooter(message.guild.name)
				.setTimestamp()
				.addFields(
					{
						name: ":fire:Attack",
						value: profile.attack,
					},
					{
						name: ":crossed_swords: Defense",
						value: profileData.defense,
					},
					{
						name: ":heart: Health",
						value: profileData.health,
					}
				)
		);
	},
};
