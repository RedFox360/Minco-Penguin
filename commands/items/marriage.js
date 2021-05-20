const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View your marriage status",
	usage: "!marriage (@user)",
	async execute(message, _0, _1, _2, profileData) {
		let profile = profileData;
		let are = "You are";
		const mention = message.mentions.users.first();
		if (mention) {
			profile = await profileModel.findOne({ userID: mention.id });
			are = `<@${mention.id}> is`;
		}
		if (profile.spouse == null) return `${are} not married`;
		message.channel.send(
			new MessageEmbed()
				.setTitle(":ring: Marriage")
				.setAuthor(message.member.nickname, message.author.avatarURL())
				.setDescription(`${are} currently married to <@${profile.spouse}>`)
				.setColor("BEDFFF") // light blue
		);
	},
};
