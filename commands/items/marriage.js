const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View your marriage status",
	execute(message, _0, _1, _2, profileData) {
		const mention = message.mentions.users.first();
		let are = "You are";
		let spouse, nickname, avatar, username;
		if (mention) {
			are = `${mention.id} is`;
			spouse = (await profileModel.findOne({ userID: mention.id })).spouse;
			nickname = message.guild.members.cache.get(mention.id).nickname;
			username = mention.username;
			avatar = mention.avatarURL();
		} else {
			spouse = profileData.spouse;
			nickname = message.member.nickname;
			username = message.author.username;
			avatar = message.author.avatarURL();
		}
		if (spouse == null) return `${are} not married`;
		message.channel.send(
			new MessageEmbed()
				.setTitle(":ring: Marriage")
				.setAuthor(nickname || username, avatar)
				.setDescription(`${are} currently married to <@${spouse}>`)
				.setColor("BEDFFF") // light blue
		);
	},
};
