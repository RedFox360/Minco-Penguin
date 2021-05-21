const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View your marriage status",
	usage: "!marriage (@user)",
	async execute(message, _0, _1, _2, profileData) {
		let profile = profileData;
		let are = "You are";
		let avatarURL = message.author.avatarURL();
		let name = message.member.displayName;
		const mention = message.mentions.users.first();
		if (mention) {
			profile = await profileModel.findOne({ userID: mention.id });
			are = `<@${mention.id}> is`;
			avatarURL = mention.avatarURL();
			name = message.guild.members.cache.get(mention.id).displayName;
		}
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
