const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View your marriage status",
	execute(message, _0, _1, _2, profileData) {
		if (profileData.spouse == null) return `${are} not married`;
		message.channel.send(
			new MessageEmbed()
				.setTitle(":ring: Marriage")
				.setAuthor(message.member.nickname || message.author.username, message.author.avatarURL())
				.setDescription(`You are currently married to <@${profileData.spouse}>`)
				.setColor("BEDFFF") // light blue
		);
	},
};
