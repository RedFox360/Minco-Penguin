const { MessageEmbed, Message } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View your marriage status",
	usage: "!marriage (@user)",
	/** @param {Message} message */
	async execute(message, _0, _1, _2, profileData) {
		const member = message.mentions.members.first();
		const name = member?.displayName ?? message.member.displayName;
		const avatarURL = member?.user?.avatarURL() ?? message.author.avatarURL();
		const profile = mention ? await profileModel.findOne({ userID: member.id }) : profileData;
		if (profile.spouse == null) return `${are} not married`;
		message.channel.send(
			new MessageEmbed()
				.setTitle(":ring: Marriage")
				.setAuthor(name, avatarURL)
				.setDescription(`${are} currently married to <@${profile.spouse}>`)
				.setColor("BEDFFF") // light blue
		);
	},
};
